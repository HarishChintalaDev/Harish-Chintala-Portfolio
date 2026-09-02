import type { Metadata, Viewport } from "next";
import { SITE_CONFIG, JSON_LD_SCHEMA } from "@/data";
import "@fontsource-variable/plus-jakarta-sans/wght.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
import "./globals.css";

export const metadata: Metadata = {
  title: SITE_CONFIG.siteTitle,
  description: SITE_CONFIG.siteDescription,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: SITE_CONFIG.author }],
  openGraph: {
    title: SITE_CONFIG.ogTitle,
    description: SITE_CONFIG.ogDescription,
    type: "website",
    locale: SITE_CONFIG.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.ogTitle,
    description: SITE_CONFIG.siteDescription,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050816" },
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(JSON_LD_SCHEMA),
          }}
        />
      </head>
      <body
        className="font-sans bg-[#050816] text-white selection:bg-[#4F8CFF] selection:text-white antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
