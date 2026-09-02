import { MetadataRoute } from "next";
import { CANONICAL_URL } from "@/data";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${CANONICAL_URL}/sitemap.xml`,
  };
}
