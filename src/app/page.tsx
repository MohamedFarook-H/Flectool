"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TOOLS, CATEGORIES, getFeaturedTools, getPopularTools } from "@/data/tools";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentTools } from "@/hooks/useRecentTools";
import { ToolCard } from "@/components/ui/ToolCard";
import { Badge } from "@/components/ui/Badge";
import { ToolIcon } from "@/components/ui/ToolIcon";

function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof TOOLS>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    const q = query.toLowerCase();
    const matched = TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q))
    ).slice(0, 6);
    setResults(matched);
    setShowDropdown(matched.length > 0);
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(slug: string) {
    setQuery("");
    setShowDropdown(false);
    router.push(`/tools/${slug}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && results.length > 0) {
      handleSelect(results[0].slug);
    }
    if (e.key === "Escape") {
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  }

  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  return (
    <section className="relative overflow-hidden pb-24 pt-20 md:pb-32 md:pt-28">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 dark:opacity-20 pointer-events-none" />
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-[var(--primary)] opacity-5 blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--muted-foreground)] mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>27+ free tools — no login required</span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[var(--foreground)] leading-[1.05] mb-6">
          Everything you need.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-violet-500">
            One simple place.
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-[var(--muted-foreground)] max-w-2xl mx-auto mb-12 leading-relaxed">
          Fast, free and private utility tools for students, developers,
          creators and everyday users. Your files stay on your device.
        </p>

        {/* Search box */}
        <div className="relative max-w-2xl mx-auto">
          <div className="relative flex items-center rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-visible">
            <svg
              className="absolute left-5 w-5 h-5 text-[var(--muted-foreground)] pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => query && results.length > 0 && setShowDropdown(true)}
              placeholder="Search for a tool... (or press ⌘K)"
              className="w-full pl-14 pr-36 py-5 bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none text-lg"
            />
            <button
              onClick={openCommandPalette}
              className="absolute right-3 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--muted)] text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              <kbd className="font-mono">⌘K</kbd>
            </button>
          </div>

          {/* Search dropdown */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl shadow-black/20 dark:shadow-black/60 overflow-hidden z-50"
            >
              {results.map((tool, i) => (
                <button
                  key={tool.slug}
                  onClick={() => handleSelect(tool.slug)}
                  className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--accent)] transition-colors text-left border-b border-[var(--border)] last:border-b-0"
                >
                  <ToolIcon name={tool.icon} category={tool.category} className="w-6 h-6" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[var(--foreground)] text-sm">
                      {tool.name}
                    </div>
                    <div className="text-xs text-[var(--muted-foreground)] truncate">
                      {tool.description}
                    </div>
                  </div>
                  <Badge category={tool.category} className="shrink-0 text-xs">
                    {CATEGORIES[tool.category]?.name ?? tool.category}
                  </Badge>
                </button>
              ))}
              <Link
                href={`/tools?q=${encodeURIComponent(query)}`}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm text-[var(--primary)] hover:bg-[var(--accent)] transition-colors"
                onClick={() => setShowDropdown(false)}
              >
                View all results for &quot;{query}&quot;
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {["JSON Formatter", "QR Generator", "EMI Calculator", "Image Compressor", "UUID Generator", "Unit Converter"].map(
            (label) => {
              const tool = TOOLS.find((t) => t.name === label);
              if (!tool) return null;
              return (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--primary)] transition-all duration-200"
                >
                  {label}
                </Link>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}

function CategoryCards() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
          Browse by category
        </h2>
        <p className="text-[var(--muted-foreground)] text-lg">
          Every tool organized for how you actually work
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(CATEGORIES).map(([key, cat]) => {
          const toolCount = TOOLS.filter((t) => t.category === key).length;
          return (
            <Link
              key={key}
              href={`/category/${key}`}
              className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center"
            >
              <ToolIcon name={cat.icon} category={cat.id} className="w-8 h-8" />
              <div>
                <div className="font-semibold text-[var(--foreground)] text-sm">
                  {cat.name}
                </div>
                <div className="text-xs text-[var(--muted-foreground)] mt-0.5">
                  {toolCount} tools
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function FeaturedTools() {
  const featured = getFeaturedTools();
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-2">
            Featured tools
          </h2>
          <p className="text-[var(--muted-foreground)]">
            Hand-picked and most loved by our users
          </p>
        </div>
        <Link
          href="/tools"
          className="hidden sm:flex items-center gap-2 text-sm text-[var(--primary)] hover:underline"
        >
          View all tools
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {featured.map((tool) => (
          <ToolCard
            key={tool.slug}
            tool={tool}
          />
        ))}
      </div>
    </section>
  );
}

function PopularTools() {
  const popular = getPopularTools();
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <section className="py-24 bg-[var(--muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
            Most popular
          </h2>
          <p className="text-[var(--muted-foreground)] text-lg">
            The tools everyone keeps coming back to
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {popular.map((tool) => (
            <ToolCard
              key={tool.slug}
              tool={tool}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function RecentTools() {
  const { recents } = useRecentTools();
  const { favorites, toggleFavorite } = useFavorites();
  const tools = recents
    .map((r) => TOOLS.find((t) => t.slug === r.slug))
    .filter(Boolean) as typeof TOOLS;

  if (tools.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">
          Recently used
        </h2>
        <span className="text-sm text-[var(--muted-foreground)]">
          Stored locally on your device
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {tools.map((tool) => (
          <ToolCard
            key={tool.slug}
            tool={tool}
          />
        ))}
      </div>
    </section>
  );
}

function TrustSection() {
  const stats = [
    { value: "27+", label: "Free tools" },
    { value: "100%", label: "Client-side processing" },
    { value: "0", label: "Account required" },
    { value: "∞", label: "Forever free" },
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((s) => (
            <div
              key={s.label}
              className="text-center p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)]"
            >
              <div className="text-4xl font-bold text-[var(--primary)] mb-2">
                {s.value}
              </div>
              <div className="text-sm text-[var(--muted-foreground)]">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Privacy banner */}
        <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] p-10 md:p-16 text-center">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[var(--primary)] via-transparent to-violet-500 opacity-5" />
          <div className="text-5xl mb-6">🔒</div>
          <h3 className="text-3xl font-bold text-[var(--foreground)] mb-4">
            Your privacy is our default
          </h3>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
            All file operations happen right in your browser. Your images, PDFs,
            and documents never touch our servers. We don&apos;t collect, store, or
            transmit your data.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryCards />
      <FeaturedTools />
      <PopularTools />
      <RecentTools />
      <TrustSection />
    </>
  );
}
