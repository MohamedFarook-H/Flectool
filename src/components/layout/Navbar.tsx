"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { CATEGORIES, ToolCategory } from "@/data/tools";

interface NavbarProps {
  onOpenSearch: () => void;
}

export function Navbar({ onOpenSearch }: NavbarProps) {
  const pathname = usePathname();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoryDropdown(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "All Tools", href: "/tools" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300 px-4 sm:px-6 pt-3 pb-2">
      <div
        className={`mx-auto max-w-6xl rounded-2xl transition-all duration-300 ${
          scrolled
            ? "glass-nav shadow-lg shadow-black/5 dark:shadow-black/25 bg-[var(--card)] py-2.5 px-4 sm:px-6"
            : "bg-[var(--card)] backdrop-blur-md border border-[var(--border)] py-3 px-4 sm:px-6"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group focus:outline-none">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-[var(--foreground)]">
                FLECTOOL
              </span>
              <span className="text-[9px] uppercase tracking-widest font-semibold text-[var(--primary)] -mt-1 hidden sm:block">
                Utility Suite
              </span>
              <span className="text-[8px] uppercase tracking-wider font-medium text-[var(--muted-foreground)] -mt-0.5 hidden sm:block">
                Powered by Flectonis
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[var(--muted)] p-1 rounded-xl border border-[var(--border)]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-[var(--card)] text-[var(--primary)] shadow-sm"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Categories Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCategoryDropdown(!categoryDropdown)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-all duration-150 ${
                  pathname.startsWith("/category")
                    ? "bg-[var(--card)] text-[var(--primary)] shadow-sm"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                Categories
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${
                    categoryDropdown ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {categoryDropdown && (
                <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl glass-panel p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted-foreground)] px-3 py-1.5">
                    Browse Categories
                  </div>
                  {Object.values(CATEGORIES).map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.id}`}
                      onClick={() => setCategoryDropdown(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-[var(--primary)] transition-colors"
                    >
                      <span>{cat.name}</span>
                      <svg className="w-3 h-3 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Controls: Search, Theme Toggle, CTA */}
          <div className="flex items-center gap-2">
            {/* Search Trigger Button */}
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Open tool search"
              className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[var(--muted)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--muted-foreground)] transition-all text-xs font-medium cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span className="hidden sm:inline">Search tools...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)] shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
              className="p-2 rounded-xl text-[var(--muted-foreground)] hover:bg-[var(--muted)] border border-[var(--border)] transition-colors"
            >
              {resolvedTheme === "dark" ? (
                <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-[var(--foreground)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </button>

            {/* Explore Tools CTA (Desktop) */}
            <Link
              href="/tools"
              className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-sm shadow-indigo-500/25 transition-all active:scale-[0.98]"
            >
              <span>Explore Tools</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>

            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 rounded-xl text-[var(--muted-foreground)] hover:bg-[var(--muted)] border border-[var(--border)]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path d="M18 6 6 18M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Sheet */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-[var(--border)] space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--muted)] text-[var(--foreground)] text-center"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted-foreground)] px-2 py-1">
                Tool Categories
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.values(CATEGORIES).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.id}`}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-[var(--primary)] transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
