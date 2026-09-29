import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Flectool Terms of Service — terms of use for our free web tools.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">Terms of Service</h1>
      <p className="text-[var(--muted-foreground)] mb-12">Last updated: January 2025</p>

      <div className="space-y-10 text-[var(--muted-foreground)] leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
            Acceptance of Terms
          </h2>
          <p>
            By accessing and using Flectool, you agree to these Terms of Service.
            If you do not agree with any part of these terms, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
            Description of Service
          </h2>
          <p>
            Flectool is a free, client-side web utility platform providing various tools
            for students, developers, and everyday users. All tools run entirely in your
            browser — no server-side processing of your data occurs.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
            Your Use of the Service
          </h2>
          <ul className="mt-4 space-y-2 list-disc list-inside">
            <li>You may use Flectool for personal, educational, or commercial purposes.</li>
            <li>You agree not to misuse the tools or attempt to interfere with their operation.</li>
            <li>You are responsible for your own data and how you use the output of our tools.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
            No Warranty
          </h2>
          <p>
            Flectool is provided "as is" without any warranties, express or implied.
            We do not guarantee that the tools will be error-free, uninterrupted, or suitable
            for any particular purpose. Use at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
            Limitation of Liability
          </h2>
          <p>
            Flectonis and Flectool shall not be liable for any direct, indirect, incidental,
            special, or consequential damages resulting from your use or inability to use
            the services, including but not limited to data loss, lost profits, or business
            interruption.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
            Privacy
          </h2>
          <p>
            Your privacy is important to us. Please review our
            <a href="/privacy" className="text-[var(--primary)] hover:underline">
              Privacy Policy
            </a>
            to understand how we handle information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
            Changes to Terms
          </h2>
          <p>
            We may update these terms from time to time. Continued use of Flectool after
            changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
            Contact
          </h2>
          <p>
            Questions about these terms? Email us at{" "}
            <a href="mailto:flectonis@gmail.com" className="text-[var(--primary)] hover:underline">
              flectonis@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}