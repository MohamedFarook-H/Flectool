import type { Metadata } from "next";
import Link from "next/link";
import { TOOLS, CATEGORIES } from "@/data/tools";
import { ToolIcon } from "@/components/ui/ToolIcon";

export const metadata: Metadata = {
  title: "About Flectool",
  description:
    "Learn about Flectool — the modern all-in-one utility platform built for students, developers, creators and everyday users. Fast, free, and private.",
};

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-24">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--muted-foreground)] mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Product by Flectonis • 27+ Tools • 100% Client-Side</span>
        </div>
        <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight text-[var(--foreground)] leading-[1.05] mb-6">
          About Flectool
        </h1>
        <p className="text-xl sm:text-2xl text-[var(--muted-foreground)] leading-relaxed max-w-3xl mx-auto">
          A modern all-in-one utility platform with 27+ free tools for students, developers,
          creators, and everyday users. Fast, free, and private by default.
        </p>
      </div>

      {/* Mission */}
      <div className="mb-20 p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)]">
        <h2 className="text-3xl font-bold text-[var(--foreground)] mb-6 text-center">
          Our Mission
        </h2>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-[var(--muted-foreground)] leading-relaxed mb-4">
            To make powerful utility tools accessible to everyone — students doing assignments,
            developers building products, creators making content, and everyday users who just need
            to get things done.
          </p>
          <p className="text-lg text-[var(--muted-foreground)] leading-relaxed mb-4">
            <strong>Fast. Free. Private.</strong> — These aren't just features, they're our foundation.
          </p>
          <p className="text-lg text-[var(--muted-foreground)] leading-relaxed">
            Every tool runs entirely in your browser. Your files never leave your device.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-[var(--foreground)] mb-10 text-center">
          Our Core Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "Lock",
              title: "Privacy by Default",
              desc: "Your files stay in your browser. All processing happens client-side using modern web APIs. We don't collect, store, or transmit your data.",
            },
            {
              icon: "Zap",
              title: "Speed Without Compromise",
              desc: "No loading spinners, no server round-trips, no bloat. Tools are built with vanilla JavaScript and web APIs for instant performance.",
            },
            {
              icon: "Gift",
              title: "Free Forever",
              desc: "No freemium tiers, no usage limits, no hidden fees. We sustain ourselves through community support — never by selling your data.",
            },
            {
              icon: "Hammer",
              title: "Craftsmanship",
              desc: "Every tool is hand-crafted with attention to detail. From micro-interactions to edge cases — we sweat the small stuff so you don't have to.",
            },
            {
              icon: "Globe",
              title: "Open Web Advocacy",
              desc: "No walled gardens, no vendor lock-in, no proprietary formats. Our tools use standard web technologies and work everywhere.",
            },
            {
              icon: "Users",
              title: "Community Driven",
              desc: "Our roadmap is shaped by real users — students, developers, creators. We listen, iterate, and ship tools that solve actual problems.",
            },
          ].map((v) => (
            <div
              key={v.title}
              className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--muted)] text-[var(--primary)] flex items-center justify-center mb-4">
                <ToolIcon name={v.icon} tile={false} className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-[var(--foreground)] text-lg mb-2">
                {v.title}
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-[var(--foreground)] mb-10 text-center">
          By the Numbers
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: `${TOOLS.length}+`, label: "Free Tools" },
            { value: `${Object.keys(CATEGORIES).length}`, label: "Categories" },
            { value: "0", label: "Account Required" },
            { value: "100%", label: "Client-Side" },
          ].map((s) => (
            <div
              key={s.label}
              className="text-center p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/50 transition-colors"
            >
              <div className="text-4xl font-bold text-[var(--primary)] mb-1">{s.value}</div>
              <div className="text-sm text-[var(--muted-foreground)]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tool Categories Showcase */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-[var(--foreground)] mb-10 text-center">
          Tools for Every Need
        </h2>
        <div className="p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)]">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-[var(--foreground)] mb-6">
                27+ Tools Across 6 Categories
              </h3>
              <p className="text-[var(--muted-foreground)] leading-relaxed mb-8">
                From academic calculators to developer utilities, image processors to finance tools —
                everything you need in one place.
              </p>
              <div className="space-y-3">
                {Object.entries(CATEGORIES).map(([key, cat]) => {
                  const count = TOOLS.filter((t) => t.category === key).length;
                  return (
                    <div
                      key={key}
                      className="flex items-center gap-4 p-3 rounded-xl bg-[var(--muted)] hover:bg-[var(--muted)]/80 transition-colors"
                    >
                      <ToolIcon name={cat.icon} category={cat.id} className="w-8 h-8" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[var(--foreground)]">{cat.name}</span>
                          <span className="text-xs text-[var(--muted-foreground)] px-2 py-0.5 rounded-full bg-[var(--card)]">{count} tools</span>
                        </div>
                        <p className="text-xs text-[var(--muted-foreground)]">{cat.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="text-center">
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--primary)] text-white font-semibold hover:opacity-90 transition-opacity text-lg"
              >
                Explore All Tools
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Technology */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-[var(--foreground)] mb-10 text-center">
          Built With Modern Web Technologies
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            "Next.js 15",
            "React 19",
            "TypeScript",
            "Tailwind CSS 4",
            "pdf-lib",
            "WebAssembly",
            "Canvas API",
            "Web Crypto API",
            "FileReader API",
            "localStorage",
          ].map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)]"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="mb-20 p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] text-center">
        <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
          Your Privacy Is Our Default
        </h2>
        <p className="text-[var(--muted-foreground)] leading-relaxed max-w-2xl mx-auto mb-8">
          All file operations happen right in your browser. Your images, PDFs,
          and documents never touch our servers. We don't collect, store, or
          transmit your data.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--muted)] text-sm text-[var(--muted-foreground)]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>100% Client-Side Processing</span>
        </div>
      </div>

      {/* Flectonis Branding */}
      <div className="mb-20 p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] text-center">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">
          Powered by Flectonis
        </h2>
        <p className="text-[var(--muted-foreground)] leading-relaxed text-lg max-w-2xl mx-auto mb-6">
          Flectool is designed and developed by <strong>Flectonis</strong> — a company
          dedicated to building fast, free, and private web tools that respect
          your time and your data.
        </p>
        <Link
          href="/flectonis"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-semibold hover:border-[var(--primary)] transition-colors"
        >
          Learn more about Flectonis
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--primary)] text-white font-semibold hover:opacity-90 transition-opacity text-lg"
        >
          Explore All Tools
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}