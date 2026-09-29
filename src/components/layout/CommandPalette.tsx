"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { TOOLS, ToolDefinition, CATEGORIES } from "@/data/tools";
import { ToolIcon } from "../ui/ToolIcon";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter tools based on query
  const filteredTools = query.trim()
    ? TOOLS.filter((tool) => {
        const q = query.toLowerCase().trim();
        return (
          tool.name.toLowerCase().includes(q) ||
          tool.category.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.keywords.some((k) => k.toLowerCase().includes(q))
        );
      })
    : TOOLS.filter((t) => t.popular).slice(0, 6);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredTools.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredTools.length - 1));
      } else if (e.key === "Enter" && filteredTools[selectedIndex]) {
        e.preventDefault();
        navigateToTool(filteredTools[selectedIndex].slug);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredTools, selectedIndex]);

  const navigateToTool = (slug: string) => {
    onClose();
    router.push(`/tools/${slug}`);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl glass-panel shadow-2xl overflow-hidden border border-[var(--border)] bg-[var(--card)] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border)]">
          <svg className="w-5 h-5 text-[var(--primary)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search tools by name, category, or task (e.g., pdf, attendance, json)..."
            className="w-full bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              Clear
            </button>
          )}
          <kbd className="px-2 py-0.5 text-[10px] font-mono rounded bg-[var(--muted)] text-[var(--muted-foreground)] border border-[var(--border)]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            {query.trim() ? `Search Results (${filteredTools.length})` : "Popular Tools"}
          </div>

          {filteredTools.length > 0 ? (
            filteredTools.map((tool, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={tool.slug}
                  type="button"
                  onClick={() => navigateToTool(tool.slug)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? "bg-[var(--muted)] text-[var(--foreground)]"
                      : "hover:bg-[var(--muted)] text-[var(--foreground)]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <ToolIcon name={tool.icon} category={tool.category} className="w-4 h-4" />
                    <div className="truncate">
                      <div className="font-semibold text-xs text-[var(--foreground)]">
                        {tool.name}
                      </div>
                      <div className="text-[11px] text-[var(--muted-foreground)] truncate">
                        {tool.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-[var(--muted)] text-[var(--muted-foreground)]">
                      {CATEGORIES[tool.category].name.replace(" Tools", "")}
                    </span>
                    {isSelected && (
                      <kbd className="hidden sm:inline text-[10px] text-[var(--primary)] font-mono">
                        ↵
                      </kbd>
                    )}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="py-10 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)]">
                🔍
              </div>
              <p className="text-xs font-semibold text-[var(--foreground)]">
                No tools found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-[11px] text-[var(--muted-foreground)]">
                Try searching for &quot;attendance&quot;, &quot;pdf&quot;, &quot;image&quot;, or &quot;emi&quot;.
              </p>
            </div>
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2.5 bg-[var(--muted)] border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--muted-foreground)]">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono text-[10px] bg-[var(--card)] px-1 py-0.5 rounded border border-[var(--border)]">↑↓</kbd> to navigate
            </span>
            <span>
              <kbd className="font-mono text-[10px] bg-[var(--card)] px-1 py-0.5 rounded border border-[var(--border)]">↵</kbd> to select
            </span>
          </div>
          <span>27 Tools available</span>
        </div>
      </div>
    </div>
  );
}
