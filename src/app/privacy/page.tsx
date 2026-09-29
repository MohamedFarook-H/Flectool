import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Flectool's privacy policy — we don't collect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">Privacy Policy</h1>
      <p className="text-[var(--muted-foreground)] mb-12">Last updated: January 2025</p>

      <div className="space-y-10 text-[var(--muted-foreground)] leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
            The short version
          </h2>
          <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium">
            🔒 Flectool processes your files entirely in your browser. Your data never leaves your device. We don&apos;t collect, store, or sell personal information.
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
            What data we collect
          </h2>
          <p>
            We do not collect personally identifiable information. Flectool does not require account creation or login. The only data stored is saved locally in your browser&apos;s <code className="bg-[var(--muted)] px-1 rounded text-sm">localStorage</code>:
          </p>
          <ul className="mt-4 space-y-2 list-disc list-inside">
            <li>Your theme preference (dark/light)</li>
            <li>Recently used tools (stored locally)</li>
            <li>Favorite tools (stored locally)</li>
          </ul>
          <p className="mt-4">This data never leaves your browser and is not transmitted to our servers.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
            File processing
          </h2>
          <p>
            All file operations (image compression, PDF processing, format conversion, etc.) are performed
            entirely in your browser using JavaScript. Your files are never uploaded to Flectool servers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Analytics</h2>
          <p>
            We may use privacy-respecting analytics (no cookies, no cross-site tracking) to understand
            which tools are popular. This data is aggregated and anonymous.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">External services</h2>
          <p>
            The QR Generator tool uses the <code className="bg-[var(--muted)] px-1 rounded text-sm">api.qrserver.com</code> API
            to render QR codes. This is the only tool that makes an external network request with user-provided data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Contact</h2>
          <p>
            Questions about privacy? Email us at{" "}
            <a href="mailto:flectonis@gmail.com" className="text-[var(--primary)] hover:underline">
              flectonis@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
