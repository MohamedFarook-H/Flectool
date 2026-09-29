import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, TOOLS, type ToolCategory } from "@/data/tools";
import { ToolIcon } from "@/components/ui/ToolIcon";

export const metadata: Metadata = {
  title: "Flectonis",
  description:
    "Flectonis — the company behind Flectool. Building fast, free, and private web tools for everyone.",
};

export default function FlectonisPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-24">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--muted-foreground)] mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Company • Product Studio • Privacy-First</span>
        </div>
        <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight text-[var(--foreground)] leading-[1.05] mb-6">
          Flectonis
        </h1>
        <p className="text-xl sm:text-2xl text-[var(--muted-foreground)] leading-relaxed max-w-3xl mx-auto">
          We build fast, free, and private web tools that respect your time and your data.
        </p>
      </div>

      {/* Mission */}
      <div className="mb-20 p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)]">
        <h2 className="text-3xl font-bold text-[var(--foreground)] mb-6 text-center">
          Our Mission
        </h2>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-[var(--muted-foreground)] leading-relaxed mb-4">
            Flectonis builds modern web utilities that respect your time and your data.
          </p>
          <p className="text-lg text-[var(--muted-foreground)] leading-relaxed mb-4">
            Flectool is our flagship product — a suite of <strong>27+ free, fast, and private tools</strong>
            accessible to everyone. No sign-ups. No subscriptions. No privacy compromises.
          </p>
          <p className="text-lg text-[var(--muted-foreground)] leading-relaxed">
            Every tool runs entirely in your browser. Your files never leave your device.
          </p>
        </div>
      </div>

      {/* Philosophy */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-[var(--foreground)] mb-10 text-center">
          Our Philosophy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "Lock",
              title: "Privacy by Default",
              desc: "We believe privacy is a fundamental right, not a premium feature. Every tool is designed client-first — your data stays on your device, period.",
            },
            {
              icon: "Zap",
              title: "Speed Without Compromise",
              desc: "No loading spinners, no server round-trips, no bloat. Our tools are built with vanilla JavaScript and modern web APIs for instant performance.",
            },
            {
              icon: "Gift",
              title: "Free Forever",
              desc: "No freemium tiers, no usage limits, no hidden fees. We sustain ourselves through privacy-respecting analytics and community support — never by selling your data.",
            },
            {
              icon: "Hammer",
              title: "Craftsmanship",
              desc: "Every tool is hand-crafted with attention to detail. From the micro-interactions to the edge cases — we sweat the small stuff so you don't have to.",
            },
            {
              icon: "Globe",
              title: "Open Web Advocacy",
              desc: "We champion the open web. No walled gardens, no vendor lock-in, no proprietary formats. Our tools use standard web technologies and work everywhere.",
            },
            {
              icon: "Users",
              title: "Community Driven",
              desc: "Our roadmap is shaped by real users — students, developers, creators. We listen, iterate, and ship tools that solve actual problems people face daily.",
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

      {/* Our Product: Flectool */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-[var(--foreground)] mb-10 text-center">
          Our Flagship Product: Flectool
        </h2>
        <div className="p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)]">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-[var(--foreground)] mb-4">
                27+ Tools. One Platform. Zero Compromises.
              </h3>
              <p className="text-[var(--muted-foreground)] leading-relaxed mb-6">
                Flectool brings together utility tools across 6 categories — all free, all private, all in one place.
              </p>
              <div className="space-y-3">
                {[
                  { id: "student", blurb: "CGPA, Attendance, Marks, Percentage, Age calculators" },
                  { id: "developer", blurb: "JSON Formatter, Base64, URL Encoder, UUID, Password Generator" },
                  { id: "document", blurb: "JPG→PDF, Merge, Split, Compress PDFs" },
                  { id: "image", blurb: "Compress, Resize, Convert, Crop" },
                  { id: "finance", blurb: "EMI, SIP, GST, Discount calculators" },
                  { id: "everyday", blurb: "QR Generator, Unit Converter, Date/Time Zone, Text Counter" },
                ].map((row) => {
                  const cat = CATEGORIES[row.id as ToolCategory];
                  const count = TOOLS.filter((t) => t.category === cat.id).length;
                  return (
                  <div
                    key={cat.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-[var(--muted)] hover:bg-[var(--muted)]/80 transition-colors"
                  >
                    <ToolIcon name={cat.icon} category={cat.id} className="w-5 h-5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[var(--foreground)]">{cat.name}</span>
                        <span className="text-xs text-[var(--muted-foreground)] px-2 py-0.5 rounded-full bg-[var(--card)]">{count} tools</span>
                      </div>
                      <p className="text-xs text-[var(--muted-foreground)]">{row.blurb}</p>
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
                Explore All 27+ Tools
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

      {/* Tech Stack */}
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

      {/* Contact / Team */}
      <div className="mb-20 p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] text-center">
        <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
          Get in Touch
        </h2>
        <p className="text-[var(--muted-foreground)] leading-relaxed max-w-xl mx-auto mb-8">
          Have questions, feedback, or want to collaborate? We'd love to hear from you.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="mailto:flectonis@gmail.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold hover:opacity-90 transition-opacity"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email: flectonis@gmail.com
          </a>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[var(--primary)] text-white font-semibold hover:opacity-90 transition-opacity text-lg"
        >
          Explore Flectool
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