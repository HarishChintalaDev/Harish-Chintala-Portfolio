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

async function deliverSubmission(endpoint: URL, submission: ContactSubmission): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DELIVERY_TIMEOUT_MS);

  try {
    const formattedName = submission.name.trim().replace(/\b\w/g, (c) => c.toUpperCase());
    const formattedCompany = submission.company.trim();

    const payload = {
      "Visitor Name": submission.name,
      "Email Address": submission.email,
      "Company / Organization": submission.company,
      "Message": submission.message,
      _subject: `📩 New Portfolio Inquiry from ${formattedName}${formattedCompany ? ` (${formattedCompany})` : ""}`,
      _replyto: submission.email,
      _template: "table",
      _captcha: "false",
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Portfolio-ContactForm/1.0",
        Referer: CANONICAL_URL,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      redirect: "manual",
      signal: controller.signal,
    });

    if (!response.ok) return false;

    try {
      const data = (await response.json()) as { success?: boolean | string };
      if (data && (data.success === false || data.success === "false")) {
        return false;
      }
    } catch {
      // If response is non-JSON 200 OK, treat as success
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
  return NextResponse.json(
    { secureDeliveryAvailable: getDeliveryEndpoint() !== null },
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
  if (!endpoint || !(await deliverSubmission(endpoint, submission))) {
    return jsonResponse(
      { error: "Contact form is temporarily unavailable. Please use the direct email link." },
      503,
      { "Retry-After": "300" },
    );
  }

  return jsonResponse({ success: true, message: "Message delivered successfully" }, 200);
}
