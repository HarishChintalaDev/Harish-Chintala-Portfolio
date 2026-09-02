import type { NextConfig } from "next";

const securityHeaders = [
  { key: "Content-Security-Policy", value: "base-uri 'self'; frame-ancestors 'none'; object-src 'none'" },
  { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=()" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  // Keep the development compiler isolated from production builds. Running
  // `next dev` and `next build` at the same time must not overwrite the same
  // manifests or client chunks, which can otherwise cause stale hydration
  // output and intermittent missing-route errors.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  // Development chunks use stable filenames. A development-only deployment
  // ID gives the browser a fresh URL after removing the previous immutable
  // cache rule, so already-poisoned caches cannot reuse the old page bundle.
  deploymentId: process.env.NODE_ENV === "development" ? "dev-cache-v2" : undefined,
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  devIndicators: false,
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "clsx",
      "tailwind-merge",
      "canvas-confetti",
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/(profile.webp|favicon.ico|Harish_Chintala_Resume.pdf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
