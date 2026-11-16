import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  // Preview/staging deployments must not be indexed.
  const isProd = process.env.VERCEL_ENV === "production" && process.env.ALLOW_INDEXING === "true";
  return isProd
    ? { rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }], sitemap: `${siteConfig.siteUrl}/sitemap.xml` }
    : { rules: [{ userAgent: "*", disallow: "/" }] };
}
