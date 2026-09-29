import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { TOOLS, CATEGORIES } from "@/data/tools";
import { ToolIcon } from "@/components/ui/ToolIcon";

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((cat) => ({ category: cat }));
}

export async function generateMetadata(
  props: PageProps<"/category/[category]">
): Promise<Metadata> {
  const { category } = await props.params;
  const cat = CATEGORIES[category as keyof typeof CATEGORIES];
  if (!cat) return { title: "Category not found" };
  const count = TOOLS.filter((t) => t.category === category).length;
  return {
    title: cat.name,
    description: `${count} free ${cat.name.toLowerCase()} tools. ${cat.description}`,
  };
}

export default async function CategoryPage(
  props: PageProps<"/category/[category]">
) {
  const { category } = await props.params;
  const cat = CATEGORIES[category as keyof typeof CATEGORIES];
  if (!cat) notFound();

  const tools = TOOLS.filter((t) => t.category === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-8">
        <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/tools" className="hover:text-[var(--foreground)] transition-colors">
          Tools
        </Link>
        <span>/</span>
        <span className="text-[var(--foreground)] font-medium">{cat.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-5 mb-4">
        <ToolIcon name={cat.icon} category={cat.id} className="w-12 h-12" />
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-2">
            {cat.name} Tools
          </h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            {cat.description}
          </p>
        </div>
      </div>
      <p className="text-sm text-[var(--muted-foreground)] mb-12">
        {tools.length} free tools available
      </p>

      {/* Tools grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {tools.map((tool) => (
          <Link key={tool.slug} href={`/tools/${tool.slug}`}>
            <div className="group flex flex-col gap-4 p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full">
              <div className="flex items-start justify-between">
                <ToolIcon name={tool.icon} category={tool.category} className="w-8 h-8" />
                {tool.badge && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--primary)] text-white">
                    {tool.badge}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1 group-hover:text-[var(--primary)] transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Other categories */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">
          Browse other categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(CATEGORIES)
            .filter(([key]) => key !== category)
            .map(([key, c]) => (
              <Link
                key={key}
                href={`/category/${key}`}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] hover:-translate-y-0.5 transition-all duration-200 text-center"
              >
                <ToolIcon name={c.icon} category={c.id} className="w-6 h-6" />
                <span className="text-sm font-medium text-[var(--foreground)]">{c.name}</span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
