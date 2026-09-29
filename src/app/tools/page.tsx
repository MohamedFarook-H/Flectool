import { Suspense } from "react";
import type { Metadata } from "next";
import { ToolsClient } from "./ToolsClient";

export const metadata: Metadata = {
  title: "All Tools",
  description:
    "Browse all 27 free Flectool utilities — student calculators, developer tools, PDF and image processors, finance calculators, and everyday converters. No signup needed.",
  openGraph: {
    title: "All Tools | Flectool",
    description:
      "27+ free, fast and private browser-based tools for students, developers, creators and everyday users.",
    type: "website",
  },
};

function ToolsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="h-14 w-64 rounded-2xl bg-[var(--muted)] mb-4" />
      <div className="h-6 w-80 rounded-xl bg-[var(--muted)] mb-10" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-44 rounded-2xl bg-[var(--muted)]" />
        ))}
      </div>
    </div>
  );
}

export default function ToolsPage() {
  return (
    <Suspense fallback={<ToolsSkeleton />}>
      <ToolsClient />
    </Suspense>
  );
}
