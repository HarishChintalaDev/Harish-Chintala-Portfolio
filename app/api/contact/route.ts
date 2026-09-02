import { NextResponse } from "next/server";
import { PERSONAL_INFO, CANONICAL_URL } from "@/data";

const MAX_BODY_BYTES = 16 * 1024;
const DELIVERY_TIMEOUT_MS = 8_000;
const ALLOWED_FIELDS = new Set(["name", "email", "company", "message"]);

const RESPONSE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  Pragma: "no-cache",
  "X-Content-Type-Options": "nosniff",
} as const;

type ContactSubmission = {
  name: string;
  email: string;
  company: string;
  message: string;
};

class RequestValidationError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
    this.name = "RequestValidationError";
  }
}

function jsonResponse(
  body: { success: true; message: string } | { error: string },
  status: number,
  headers: Record<string, string> = {},
) {
  return NextResponse.json(body, {
    status,
    headers: { ...RESPONSE_HEADERS, ...headers },
  });
}

async function readBoundedJson(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    throw new RequestValidationError("Content-Type must be application/json", 415);
  }

  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader !== null) {
    const contentLength = Number(contentLengthHeader);
    if (!Number.isSafeInteger(contentLength) || contentLength < 0) {
      throw new RequestValidationError("Invalid Content-Length header");
    }
    if (contentLength > MAX_BODY_BYTES) {
      throw new RequestValidationError("Request body is too large", 413);
    }
  }

  if (!request.body) {
    throw new RequestValidationError("A JSON request body is required");
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalLength = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalLength += value.byteLength;
      if (totalLength > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new RequestValidationError("Request body is too large", 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  if (totalLength === 0) {
    throw new RequestValidationError("A JSON request body is required");
  }

  const bodyBytes = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    bodyBytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    const bodyText = new TextDecoder("utf-8", { fatal: true }).decode(bodyBytes);
    return JSON.parse(bodyText) as unknown;
  } catch {
    throw new RequestValidationError("Request body must contain valid UTF-8 JSON");
  }
}

function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readStringField(
  body: Record<string, unknown>,
  field: keyof ContactSubmission,
  maximumLength: number,
  required: boolean,
): string {
  const rawValue = body[field];

  if (rawValue === undefined) {
    if (required) throw new RequestValidationError(`${field} is required`);
    return "";
  }
  if (typeof rawValue !== "string") {
    throw new RequestValidationError(`${field} must be a string`);
  }

  const value = rawValue.trim();
  if (required && value.length === 0) {
    throw new RequestValidationError(`${field} is required`);
  }
  if (value.length > maximumLength) {
    throw new RequestValidationError(`${field} is too long`);
  }

  return value;
}

function isValidEmail(email: string): boolean {
  if (email.length > 254 || /[\u0000-\u0020\u007f]/u.test(email)) return false;

  const segments = email.split("@");
  if (segments.length !== 2) return false;

  const [localPart, domain] = segments;
  if (
    localPart.length === 0 ||
    localPart.length > 64 ||
    localPart.startsWith(".") ||
    localPart.endsWith(".") ||
    localPart.includes("..")
  ) {
    return false;
  }

  const domainLabels = domain.split(".");
  return (
    domain.length <= 253 &&
    domainLabels.length >= 2 &&
    domainLabels.every(
      (label) =>
        label.length > 0 &&
        label.length <= 63 &&
        !label.startsWith("-") &&
        !label.endsWith("-") &&
        /^[a-z0-9-]+$/iu.test(label),
    )
  );
}

function validateSubmission(value: unknown): ContactSubmission {
  if (!isJsonObject(value)) {
    throw new RequestValidationError("Request body must be a JSON object");
  }

  for (const key of Object.keys(value)) {
    if (!ALLOWED_FIELDS.has(key)) {
      throw new RequestValidationError(`Unexpected field: ${key}`);
    }
  }

  const submission = {
    name: readStringField(value, "name", 100, true),
    email: readStringField(value, "email", 254, true),
    company: readStringField(value, "company", 150, false),
    message: readStringField(value, "message", 5_000, true),
  };

  if (/[\u0000-\u001f\u007f]/u.test(submission.name)) {
    throw new RequestValidationError("name contains invalid characters");
  }
  if (/[\u0000-\u001f\u007f]/u.test(submission.company)) {
    throw new RequestValidationError("company contains invalid characters");
  }
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(submission.message)) {
    throw new RequestValidationError("message contains invalid characters");
  }
  if (!isValidEmail(submission.email)) {
    throw new RequestValidationError("email must be a valid email address");
  }

  return submission;
}

function getDeliveryEndpoint(): URL | null {
  const configuredEndpoint =
    process.env.CONTACT_FORM_ENDPOINT?.trim() ||
    `https://formsubmit.co/ajax/${PERSONAL_INFO.email}`;

  try {
    const endpoint = new URL(configuredEndpoint);
    if (
      (endpoint.protocol !== "https:" && endpoint.protocol !== "http:") ||
      endpoint.username ||
      endpoint.password
    ) {
      return null;
    }
    return endpoint;
  } catch {
    return null;
  }
}

async function deliverSubmission(
  endpoint: URL,
  submission: ContactSubmission,
  requestOrigin?: string,
): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DELIVERY_TIMEOUT_MS);

  try {
    const formattedName = submission.name.trim().replace(/\b\w/g, (c) => c.toUpperCase());
    const formattedCompany = submission.company.trim();

    // 1. Direct delivery via Resend (Recommended for Vercel production)
    if (process.env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY.trim()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from:
              process.env.RESEND_FROM_EMAIL?.trim() ||
              "Portfolio Contact <onboarding@resend.dev>",
            to: [PERSONAL_INFO.email],
            reply_to: submission.email,
            subject: `📩 New Resume Download / Inquiry: ${formattedName}${formattedCompany ? ` (${formattedCompany})` : ""}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;">
                <h2 style="color: #0284c7; margin-bottom: 16px;">New Resume Gate & Contact Submission</h2>
                <p><strong>Name:</strong> ${submission.name}</p>
                <p><strong>Email:</strong> <a href="mailto:${submission.email}">${submission.email}</a></p>
                <p><strong>Company:</strong> ${submission.company || "N/A"}</p>
                <p><strong>Message:</strong></p>
                <div style="background: #f8fafc; padding: 14px; border-left: 4px solid #0284c7; margin-top: 8px; white-space: pre-wrap;">${submission.message}</div>
              </div>
            `,
          }),
          signal: controller.signal,
        });

        if (resendRes.ok) return true;
        const resendData = await resendRes.text();
        console.error("Resend delivery failed:", resendData);
      } catch (resendErr) {
        console.error("Resend API error:", resendErr);
      }
    }

    // 2. Direct delivery via Web3Forms (if access key provided)
    if (process.env.WEB3FORMS_ACCESS_KEY) {
      try {
        const web3Res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: process.env.WEB3FORMS_ACCESS_KEY.trim(),
            name: submission.name,
            email: submission.email,
            company: submission.company || "N/A",
            message: submission.message,
            subject: `📩 New Portfolio Inquiry from ${formattedName}${formattedCompany ? ` (${formattedCompany})` : ""}`,
            from_name: "Portfolio Notification",
          }),
          signal: controller.signal,
        });

        if (web3Res.ok) return true;
      } catch (web3Err) {
        console.error("Web3Forms API error:", web3Err);
      }
    }

    // 3. Fallback delivery to configured endpoint (FormSubmit / custom)
    const payload = {
      "Visitor Name": submission.name,
      "Email Address": submission.email,
      "Company / Organization": submission.company || "N/A",
      "Message": submission.message,
      _subject: `📩 New Portfolio Inquiry from ${formattedName}${formattedCompany ? ` (${formattedCompany})` : ""}`,
      _replyto: submission.email,
      _template: "table",
      _captcha: "false",
    };

    // Use actual incoming request origin (or fallback to CANONICAL_URL)
    const activeOrigin = (requestOrigin || CANONICAL_URL).replace(/\/+$/, "");

    const response = await fetch(endpoint.toString(), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Portfolio-ContactForm/1.0",
        Origin: activeOrigin,
        Referer: `${activeOrigin}/`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(`Endpoint ${endpoint} returned status ${response.status}: ${errorText}`);
      return false;
    }

    try {
      const data = (await response.json()) as { success?: boolean | string; message?: string };
      if (data && (data.success === false || data.success === "false")) {
        console.error("Endpoint returned false status:", data.message || data);
        return false;
      }
    } catch {
      // Non-JSON 200 OK treated as success
    }

    return true;
  } catch (err) {
    console.error("deliverSubmission error:", err);
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  const hasServerProvider = !!(
    process.env.RESEND_API_KEY ||
    process.env.WEB3FORMS_ACCESS_KEY ||
    process.env.CONTACT_FORM_ENDPOINT
  );

  return NextResponse.json(
    {
      secureDeliveryAvailable: true,
      serverDeliveryAvailable: hasServerProvider,
      fallbackEndpoint: `https://formsubmit.co/ajax/${PERSONAL_INFO.email}`,
    },
    { status: 200, headers: { ...RESPONSE_HEADERS } },
  );
}

export async function POST(request: Request) {
  let submission: ContactSubmission;

  try {
    submission = validateSubmission(await readBoundedJson(request));
  } catch (error) {
    if (error instanceof RequestValidationError) {
      return jsonResponse({ error: error.message }, error.status);
    }
    return jsonResponse({ error: "Unable to process request" }, 400);
  }

  const endpoint = getDeliveryEndpoint();
  const requestOrigin = request.headers.get("origin") || request.headers.get("referer") || undefined;
  if (!endpoint || !(await deliverSubmission(endpoint, submission, requestOrigin))) {
    return jsonResponse(
      { error: "Contact form is temporarily unavailable. Please use the direct email link." },
      503,
      { "Retry-After": "300" },
    );
  }

  return jsonResponse({ success: true, message: "Message delivered successfully" }, 200);
}
