"use client";

import React from "react";
import Link from "next/link";
import { ToolDefinition, CATEGORIES } from "@/data/tools";
import { ToolIcon } from "./ToolIcon";
import { Badge } from "./Badge";
import { useFavorites } from "@/hooks/useFavorites";

interface ToolCardProps {
  tool: ToolDefinition;
  showCategory?: boolean;
}

export function ToolCard({ tool, showCategory = true }: ToolCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(tool.slug);
  const categoryInfo = CATEGORIES[tool.category];

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(tool.slug);
  };

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative flex flex-col p-5 rounded-2xl glass-card text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 overflow-hidden"
    >
      {/* Background glow accent on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-cyan-500/0 group-hover:from-indigo-500/5 group-hover:to-cyan-500/5 transition-all duration-300 pointer-events-none" />

      <div className="flex items-start justify-between gap-3 relative z-10 mb-4">
        <ToolIcon name={tool.icon} category={tool.category} className="w-5 h-5" />

        <div className="flex items-center gap-1.5">
          {tool.badge && (
            <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
              {tool.badge}
            </span>
          )}
          <button
            type="button"
            onClick={handleFavoriteClick}
            aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
            className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-amber-500 hover:bg-[var(--muted)] transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform active:scale-125 ${
                favorited ? "fill-amber-400 text-amber-400" : "fill-none"
              }`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 relative z-10 space-y-1.5">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors text-base line-clamp-1">
            {tool.name}
          </h3>
        </div>
        <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
          {tool.description}
        </p>
      </div>

      <div className="mt-4 pt-3.5 border-t border-[var(--border)] flex items-center justify-between relative z-10 text-xs text-[var(--muted-foreground)]">
        {showCategory ? (
          <span className="font-medium text-[var(--muted-foreground)]">
            {categoryInfo.name.replace(" Tools", "")}
          </span>
        ) : (
          <span className="font-mono text-[11px]">Free Tool</span>
        )}

        <span className="inline-flex items-center gap-1 font-medium text-[var(--primary)] opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
          Open
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
