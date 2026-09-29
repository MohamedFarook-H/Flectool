import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://flectool.app/sitemap.xml",
    host: "https://flectool.app",
  };
}
