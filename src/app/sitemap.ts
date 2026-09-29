import type { MetadataRoute } from "next";
import { TOOLS, CATEGORIES } from "@/data/tools";

const BASE_URL = "https://flectool.app";

/** Static pages that aren't derived from the tool data. */
const STATIC_PAGES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/tools", priority: 0.9, changeFrequency: "weekly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/flectonis", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    ...STATIC_PAGES.map((page) => ({
      url: `${BASE_URL}${page.path}`,
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...Object.values(CATEGORIES).map((cat) => ({
      url: `${BASE_URL}/category/${cat.id}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...TOOLS.map((tool) => ({
      url: `${BASE_URL}/tools/${tool.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: tool.popular ? 0.8 : 0.7,
    })),
  ];
}
