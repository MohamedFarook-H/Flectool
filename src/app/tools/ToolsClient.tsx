"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { TOOLS, CATEGORIES } from "@/data/tools";
import { ToolCard } from "@/components/ui/ToolCard";
import { useFavorites } from "@/hooks/useFavorites";

type SortOption = "default" | "name" | "category";
type FilterOption = "all" | "popular" | "favorites";

export function ToolsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { favorites } = useFavorites();

  const rawFilter = searchParams.get("filter");
  const filter: FilterOption =
    rawFilter === "popular" || rawFilter === "favorites" ? rawFilter : "all";

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortOption>("default");

  const setFilter = useCallback(
    (next: FilterOption) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === "all") params.delete("filter");
      else params.set("filter", next);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const filtered = useMemo(() => {
    let list = TOOLS;

    if (filter === "popular") {
      list = list.filter((t) => t.popular);
    } else if (filter === "favorites") {
      list = list.filter((t) => favorites.includes(t.slug));
    }

    if (activeCategory !== "all") {
      list = list.filter((t) => t.category === activeCategory);
    }

    if (sort === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "category") {
      list = [...list].sort((a, b) => a.category.localeCompare(b.category));
    }

    return list;
  }, [filter, favorites, activeCategory, sort]);

  const FILTERS: { id: FilterOption; label: string; count: number }[] = [
    { id: "all", label: "All Tools", count: TOOLS.length },
    { id: "popular", label: "Popular", count: TOOLS.filter((t) => t.popular).length },
    { id: "favorites", label: "My Favorites", count: favorites.length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">
          All Tools
        </h1>
        <p className="text-lg text-[var(--muted-foreground)]">
          {TOOLS.length} free tools — no login, no limits
        </p>
      </div>

      {/* Sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          aria-label="Sort tools"
          className="px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] cursor-pointer min-w-[160px]"
        >
          <option value="default">Sort: Default</option>
          <option value="name">Sort: A–Z</option>
          <option value="category">Sort: Category</option>
        </select>
      </div>

      {/* Primary filter (URL-driven) */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
              filter === f.id
                ? "bg-[var(--primary)] border-[var(--primary)] text-white"
                : "border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--primary)]"
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setActiveCategory("all")}
          aria-pressed={activeCategory === "all"}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
            activeCategory === "all"
              ? "bg-[var(--primary)] border-[var(--primary)] text-white"
              : "border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--primary)]"
          }`}
        >
          All ({TOOLS.length})
        </button>
        {Object.entries(CATEGORIES).map(([key, cat]) => {
          const count = TOOLS.filter(
            (t) => t.category === key && (filter === "all" || (filter === "popular" ? t.popular : favorites.includes(t.slug)))
          ).length;
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              aria-pressed={activeCategory === key}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                activeCategory === key
                  ? "bg-[var(--primary)] border-[var(--primary)] text-white"
                  : "border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--primary)]"
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[var(--muted)] flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--muted-foreground)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-7 h-7"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
            {filter === "favorites" ? "No favorites yet" : "No tools found"}
          </h3>
          <p className="text-[var(--muted-foreground)]">
            {filter === "favorites"
              ? "Tap the ☆ Save button on any tool to add it here."
              : "Try a different category"}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-[var(--muted-foreground)] mb-6">
            Showing {filtered.length} tool{filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
