import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getToolBySlug, getRelatedTools, CATEGORIES, TOOLS } from "@/data/tools";
import { ToolPageClient } from "./ToolPageClient";

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(props: PageProps<"/tools/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: "Tool not found" };
  // `absolute` bypasses the root title template, so the suffix is written once here
  // instead of being appended twice by "%s | Flectool".
  const fullTitle = `${tool.seoTitle} | Flectool`;
  return {
    title: { absolute: fullTitle },
    description: tool.seoDescription,
    keywords: tool.keywords,
    openGraph: {
      title: fullTitle,
      description: tool.seoDescription,
      type: "website",
    },
  };
}

export default async function ToolPage(props: PageProps<"/tools/[slug]">) {
  const { slug } = await props.params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const related = getRelatedTools(slug, 3);
  const category = CATEGORIES[tool.category];

  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ToolPageClient tool={tool} related={related} category={category} />
    </Suspense>
  );
}
