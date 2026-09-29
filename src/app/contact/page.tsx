import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "./ContactForm";
import { ToolIcon } from "@/components/ui/ToolIcon";
import { CONTACT_EMAIL, GITHUB_URL, GITHUB_HANDLE } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Flectool by Flectonis. Report a bug, request a tool, or send feedback — we read every message.",
};

function GithubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58l-.01-2.05c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.12-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.77.84 1.24 1.92 1.24 3.23 0 4.62-2.8 5.64-5.48 5.94.43.37.81 1.1.81 2.22l-.01 3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
    </svg>
  );
}

function MailIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function FormSkeleton() {
  return (
    <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)]">
      <div className="h-8 w-56 rounded-xl bg-[var(--muted)] mb-3" />
      <div className="h-4 w-80 max-w-full rounded-lg bg-[var(--muted)] mb-8" />
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="h-16 rounded-xl bg-[var(--muted)]" />
          <div className="h-16 rounded-xl bg-[var(--muted)]" />
        </div>
        <div className="h-16 rounded-xl bg-[var(--muted)]" />
        <div className="h-32 rounded-xl bg-[var(--muted)]" />
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--muted-foreground)] mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>We read every message</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-[var(--foreground)] leading-[1.05] mb-6">
          Get in touch
        </h1>
        <p className="text-lg sm:text-xl text-[var(--muted-foreground)] leading-relaxed max-w-2xl mx-auto">
          Found a bug, need a tool that doesn&apos;t exist, or just want to say
          hello? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        {/* Form */}
        <Suspense fallback={<FormSkeleton />}>
          <ContactForm />
        </Suspense>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-24">
          {/* Direct links */}
          <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--card)]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)] mb-4">
              Reach us directly
            </h2>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex items-start gap-3 p-3 rounded-xl bg-[var(--muted)] hover:bg-[var(--muted)]/70 transition-colors group mb-2"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shrink-0">
                <MailIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-[var(--muted-foreground)] mb-0.5">
                  Email
                </div>
                <div className="text-sm font-medium text-[var(--foreground)] break-all group-hover:text-[var(--primary)] transition-colors">
                  {CONTACT_EMAIL}
                </div>
              </div>
            </a>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-3 rounded-xl bg-[var(--muted)] hover:bg-[var(--muted)]/70 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center shrink-0">
                <GithubIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-[var(--muted-foreground)] mb-0.5">
                  GitHub
                </div>
                <div className="text-sm font-medium text-[var(--foreground)] break-all group-hover:text-[var(--primary)] transition-colors">
                  {GITHUB_HANDLE}
                </div>
                <div className="text-xs text-[var(--muted-foreground)] mt-0.5">
                  See all repositories
                </div>
              </div>
            </a>
          </div>

          {/* What to expect */}
          <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--card)]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)] mb-4">
              What to expect
            </h2>
            <ul className="space-y-3 text-sm text-[var(--muted-foreground)]">
              {[
                {
                  icon: "Mail",
                  text: "A reply to the email address you provide in the form.",
                },
                {
                  icon: "CheckCircle2",
                  text: "Bug reports are verified and fixed when we can reproduce them.",
                },
                {
                  icon: "Layers",
                  text: "Tool requests genuinely shape the roadmap — send them.",
                },
              ].map((item) => (
                <li key={item.text} className="flex gap-3">
                  <ToolIcon
                    name={item.icon}
                    tile={false}
                    className="w-4 h-4 mt-0.5 shrink-0 text-[var(--primary)]"
                  />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Flectonis card */}
          <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--muted)]">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
              A product of
            </div>
            <div className="text-lg font-bold text-[var(--foreground)] mb-2">
              Flectonis
            </div>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-4">
              Flectool is built and maintained by Flectonis — a company dedicated
              to fast, free, and private web tools.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <Link
                href="/about"
                className="text-[var(--primary)] font-medium hover:underline"
              >
                About Flectool
              </Link>
              <Link
                href="/flectonis"
                className="text-[var(--primary)] font-medium hover:underline"
              >
                About Flectonis
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
