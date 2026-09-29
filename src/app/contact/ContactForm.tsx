"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, TOOLS } from "@/data/tools";
import {
  buildMailto,
  validate,
  CONTACT_EMAIL,
  TOPICS,
  EMPTY_FORM,
  type FormState,
} from "@/lib/contact";

export function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  // Errors stay hidden until the first submit attempt, so the form doesn't
  // yell at the visitor while they're still filling it in.
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState(false);

  const errors = useMemo(() => validate(form), [form]);
  const hasErrors = Object.keys(errors).length > 0;
  const mailto = useMemo(() => buildMailto(form), [form]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSent(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const err = (key: keyof FormState) => (submitted ? errors[key] : undefined);

  const inputBase =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] text-sm px-3.5 py-2.5 outline-none transition-all duration-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20";

  const labelCls = "block text-xs font-semibold text-[var(--foreground)] mb-1.5";
  const errCls = "text-xs text-rose-500 font-medium mt-1.5";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-[var(--card)]"
    >
      <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
        Send us a message
      </h2>
      <p className="text-sm text-[var(--muted-foreground)] mb-6">
        Fill this in and your email app opens with everything pre-filled — just
        press send.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="contact-name" className={labelCls}>
            Your name <span className="text-rose-500">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Ada Lovelace"
            aria-invalid={!!err("name")}
            className={inputBase}
          />
          {err("name") && <p className={errCls}>{err("name")}</p>}
        </div>

        <div>
          <label htmlFor="contact-email" className={labelCls}>
            Your email <span className="text-rose-500">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
            aria-invalid={!!err("email")}
            className={inputBase}
          />
          {err("email") && <p className={errCls}>{err("email")}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="contact-topic" className={labelCls}>
            Topic
          </label>
          <select
            id="contact-topic"
            name="topic"
            value={form.topic}
            onChange={(e) => set("topic", e.target.value)}
            className={`${inputBase} cursor-pointer`}
          >
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="contact-tool" className={labelCls}>
            Related tool{" "}
            <span className="text-[var(--muted-foreground)] font-normal">
              (optional)
            </span>
          </label>
          <select
            id="contact-tool"
            name="tool"
            value={form.tool}
            onChange={(e) => set("tool", e.target.value)}
            className={`${inputBase} cursor-pointer`}
          >
            <option value="">Not specified</option>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <optgroup key={key} label={cat.name}>
                {TOOLS.filter((t) => t.category === key).map((t) => (
                  <option key={t.slug} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="contact-message" className={labelCls}>
          Message <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Tell us what you need, what's broken, or what you'd love to see next…"
          aria-invalid={!!err("message")}
          className={`${inputBase} resize-y`}
        />
        {err("message") && <p className={errCls}>{err("message")}</p>}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* A real anchor rather than a button: the mailto is a genuine link, so
            it works without JS navigation, shows the target on hover, and can
            be opened in a new tab or copied. */}
        <a
          href={mailto}
          onClick={(e) => {
            if (hasErrors) {
              e.preventDefault();
              setSubmitted(true);
              return;
            }
            setSent(true);
          }}
          aria-disabled={hasErrors}
          className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
            hasErrors
              ? "bg-[var(--muted)] text-[var(--muted-foreground)] cursor-not-allowed"
              : "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8" />
            <path d="M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
          </svg>
          {hasErrors ? "Fill in the required fields" : "Open in my email app"}
        </a>

        <button
          type="button"
          onClick={() => {
            setForm(EMPTY_FORM);
            setSubmitted(false);
            setSent(false);
          }}
          className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          Clear form
        </button>
      </div>

      {sent && (
        <div
          role="status"
          className="mt-6 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm flex gap-3"
        >
          <svg
            className="w-5 h-5 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <span>
            Your email app should now be open with the message ready to send. If
            nothing happened, use the direct email link below.
          </span>
        </div>
      )}

      <p className="mt-6 text-xs text-[var(--muted-foreground)]">
        Prefer to write directly?{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-[var(--primary)] font-medium hover:underline"
        >
          {CONTACT_EMAIL}
        </a>
      </p>
    </form>
  );
}
