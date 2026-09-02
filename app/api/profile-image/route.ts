import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

type ImageCandidate = {
  name: string;
  mime: string;
};

const CANDIDATE_IMAGES: ImageCandidate[] = [
  { name: "profile-small.webp", mime: "image/webp" },
  { name: "profile.webp", mime: "image/webp" },
  { name: "profile.avif", mime: "image/avif" },
  { name: "profile.png", mime: "image/png" },
  { name: "profile.jpg", mime: "image/jpeg" },
  { name: "profile.jpeg", mime: "image/jpeg" },
  { name: "profile.svg", mime: "image/svg+xml" },
  { name: "profile.PNG", mime: "image/png" },
  { name: "profile.JPG", mime: "image/jpeg" },
];

const FALLBACK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" fill="none">
  <rect width="200" height="200" rx="30" fill="#0A0F24"/>
  <circle cx="100" cy="70" r="35" fill="#38BDF8" opacity="0.8"/>
  <path d="M40 160 C40 120, 160 120, 160 160 Z" fill="#818CF8" opacity="0.8"/>
</svg>`;

async function findProfileImage(publicDirectory: string) {
  for (const candidate of CANDIDATE_IMAGES) {
    try {
      const buffer = await readFile(path.join(publicDirectory, candidate.name));
      return { buffer, mime: candidate.mime };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }

  return null;
}

export async function GET() {
  try {
    const image = await findProfileImage(path.join(process.cwd(), "public"));

    if (image) {
      return new NextResponse(new Uint8Array(image.buffer), {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
          "Content-Length": image.buffer.byteLength.toString(),
          "Content-Type": image.mime,
          "X-Content-Type-Options": "nosniff",
        },
      });
    }

    return new NextResponse(FALLBACK_SVG, {
      status: 200,
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "image/svg+xml; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Error loading profile image", {
      status: 500,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }
}
