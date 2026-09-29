import React from "react";
import Link from "next/link";
import { CATEGORIES } from "@/data/tools";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--card)] backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/20">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
              </div>
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-[var(--foreground)] to-[var(--muted-foreground)] bg-clip-text text-transparent">
                FLECTOOL
              </span>
            </Link>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              Simple tools. Better workflows. Fast, free and beautifully modern utilities for everyday tasks.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              100% Client-Side Privacy
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                  All 27 Tools
                </Link>
              </li>
              <li>
                <Link href="/tools?filter=popular" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                  Popular Utilities
                </Link>
              </li>
              <li>
                <Link href="/tools?filter=favorites" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                  My Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* Tool Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {Object.values(CATEGORIES).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.id}`}
                    className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                  About Flectool
                </Link>
              </li>
              <li>
                <Link href="/flectonis" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                  About Flectonis
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a href="mailto:flectonis@gmail.com" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                  flectonis@gmail.com
                </a>
              </li>
              <li>
                <Link href="/privacy" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--muted-foreground)]">
          <div>© 2026 Flectonis. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span>Built for the modern web.</span>
            <span>•</span>
            <span className="text-[var(--primary)] font-medium">Fast. Free. Private.</span>
            <span>•</span>
            <span>Powered By Flectonis</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
