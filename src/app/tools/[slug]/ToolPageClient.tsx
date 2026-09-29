"use client";

import { lazy, Suspense } from "react";
import Link from "next/link";
import type { ToolDefinition, CategoryInfo } from "@/data/tools";
import { ToolCard } from "@/components/ui/ToolCard";
import { Badge } from "@/components/ui/Badge";
import { ToolIcon } from "@/components/ui/ToolIcon";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentTools } from "@/hooks/useRecentTools";
import { useEffect } from "react";

// Lazy-load all tool components (handle both named and default exports)
function lazyNamed(importFn: () => Promise<{ [key: string]: React.ComponentType }>, name: string) {
  return lazy(() => importFn().then((mod) => {
    const component = mod[name] || mod.default;
    return { default: component };
  }));
}

const toolComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  // Student
  "attendance-calculator": lazyNamed(() => import("@/components/tools/student/AttendanceCalculator"), "AttendanceCalculator"),
  "cgpa-calculator": lazyNamed(() => import("@/components/tools/student/CgpaCalculator"), "CgpaCalculator"),
  "percentage-calculator": lazyNamed(() => import("@/components/tools/student/PercentageCalculator"), "PercentageCalculator"),
  "marks-calculator": lazyNamed(() => import("@/components/tools/student/MarksCalculator"), "MarksCalculator"),
  "age-calculator": lazyNamed(() => import("@/components/tools/student/AgeCalculator"), "AgeCalculator"),
  // Developer
  "json-formatter": lazyNamed(() => import("@/components/tools/developer/JsonFormatter"), "JsonFormatter"),
  "base64-converter": lazyNamed(() => import("@/components/tools/developer/Base64Converter"), "Base64Converter"),
  "url-encoder": lazyNamed(() => import("@/components/tools/developer/UrlEncoder"), "UrlEncoder"),
  "uuid-generator": lazyNamed(() => import("@/components/tools/developer/UuidGenerator"), "UuidGenerator"),
  "password-generator": lazyNamed(() => import("@/components/tools/developer/PasswordGenerator"), "PasswordGenerator"),
  // Finance
  "emi-calculator": lazyNamed(() => import("@/components/tools/finance/EmiCalculator"), "EmiCalculator"),
  "sip-calculator": lazyNamed(() => import("@/components/tools/finance/SipCalculator"), "SipCalculator"),
  "gst-calculator": lazyNamed(() => import("@/components/tools/finance/GstCalculator"), "GstCalculator"),
  "discount-calculator": lazyNamed(() => import("@/components/tools/finance/DiscountCalculator"), "DiscountCalculator"),
  // Document
  "jpg-to-pdf": lazyNamed(() => import("@/components/tools/document/JpgToPdf"), "JpgToPdf"),
  "pdf-merge": lazyNamed(() => import("@/components/tools/document/PdfMerge"), "PdfMerge"),
  "pdf-split": lazyNamed(() => import("@/components/tools/document/PdfSplit"), "PdfSplit"),
  "pdf-compressor": lazyNamed(() => import("@/components/tools/document/PdfCompressor"), "PdfCompressor"),
  // Image
  "image-compressor": lazyNamed(() => import("@/components/tools/image/ImageCompressor"), "ImageCompressor"),
  "image-resizer": lazyNamed(() => import("@/components/tools/image/ImageResizer"), "ImageResizer"),
  "image-converter": lazyNamed(() => import("@/components/tools/image/ImageConverter"), "ImageConverter"),
  "image-cropper": lazyNamed(() => import("@/components/tools/image/ImageCropper"), "ImageCropper"),
  // Everyday
  "qr-generator": lazyNamed(() => import("@/components/tools/everyday/QrGenerator"), "QrGenerator"),
  "unit-converter": lazyNamed(() => import("@/components/tools/everyday/UnitConverter"), "UnitConverter"),
  "date-calculator": lazyNamed(() => import("@/components/tools/everyday/DateCalculator"), "DateCalculator"),
  "time-zone-converter": lazyNamed(() => import("@/components/tools/everyday/TimeZoneConverter"), "TimeZoneConverter"),
  "text-counter": lazyNamed(() => import("@/components/tools/everyday/TextCounter"), "TextCounter"),
};

function ToolLoader() {
  return (
    <div className="flex items-center justify-center h-48 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
        <span className="text-sm text-[var(--muted-foreground)]">Loading tool...</span>
      </div>
    </div>
  );
}

interface ToolPageClientProps {
  tool: ToolDefinition;
  related: ToolDefinition[];
  category: CategoryInfo;
}

export function ToolPageClient({ tool, related, category }: ToolPageClientProps) {
  const { favorites, toggleFavorite } = useFavorites();
  const { addRecent } = useRecentTools();
  const isFavorited = favorites.includes(tool.slug);

  useEffect(() => {
    addRecent(tool.slug);
  }, [tool.slug, addRecent]);

  const ToolComponent = toolComponents[tool.slug];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <Link
          href={`/category/${tool.category}`}
          className="hover:text-[var(--foreground)] transition-colors"
        >
          {category?.name}
        </Link>
        <span>/</span>
        <span className="text-[var(--foreground)] font-medium truncate">{tool.name}</span>
      </nav>

      {/* Tool header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div className="flex items-start gap-5">
          <ToolIcon
            name={tool.icon}
            category={tool.category}
            className="w-9 h-9 sm:w-10 sm:h-10"
          />
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)]">
                {tool.name}
              </h1>
              {tool.badge && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--primary)] text-white">
                  {tool.badge}
                </span>
              )}
            </div>
            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl">
              {tool.description}
            </p>
            <div className="flex items-center gap-3 mt-3">
              <Badge category={tool.category}>{category?.name}</Badge>
              <span className="text-sm text-[var(--muted-foreground)]">Free · No signup · Private</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => toggleFavorite(tool.slug)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all shrink-0 ${
            isFavorited
              ? "border-amber-400 bg-amber-400/10 text-amber-500"
              : "border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          <span>{isFavorited ? "★" : "☆"}</span>
          <span>{isFavorited ? "Saved" : "Save"}</span>
        </button>
      </div>

      {/* Tool component */}
      <div className="mb-12">
        {ToolComponent ? (
          <Suspense fallback={<ToolLoader />}>
            <ToolComponent />
          </Suspense>
        ) : (
          <div className="flex items-center justify-center h-48 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <p className="text-[var(--muted-foreground)]">Tool coming soon...</p>
          </div>
        )}
      </div>

      {/* Info section */}
      {tool.info && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {/* What is it */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
              <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">
                What is {tool.name}?
              </h2>
              <p className="text-[var(--muted-foreground)] leading-relaxed">
                {tool.info.whatIs}
              </p>
            </div>
            {tool.info.howTo && tool.info.howTo.length > 0 && (
              <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
                <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">
                  How to use
                </h2>
                <ol className="space-y-3">
                  {tool.info.howTo.map((step, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="w-7 h-7 rounded-full bg-[var(--primary)] text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-[var(--muted-foreground)] leading-relaxed">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {tool.info.formulaOrDetails && (
              <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
                <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">
                  Formula & Details
                </h2>
                <p className="text-[var(--muted-foreground)] leading-relaxed whitespace-pre-wrap font-mono text-sm">
                  {tool.info.formulaOrDetails}
                </p>
              </div>
            )}
          </div>

          {/* Features */}
          {tool.info.features && tool.info.features.length > 0 && (
            <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] h-fit">
              <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">
                Features
              </h2>
              <ul className="space-y-3">
                {tool.info.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm text-[var(--muted-foreground)]">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Related tools */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">
            Related tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((t) => (
              <ToolCard
                key={t.slug}
                tool={t}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
