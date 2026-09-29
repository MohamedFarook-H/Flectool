import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { LayoutClient } from "@/components/layout/LayoutClient";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Flectool — Everything you need. One simple place.",
    template: "%s | Flectool",
  },
  description:
    "Flectool is a modern all-in-one utility platform with 27+ free tools for students, developers, creators and everyday users. No login required.",
  keywords: [
    "free online tools",
    "student tools",
    "developer tools",
    "image converter",
    "pdf tools",
    "unit converter",
    "calculator",
    "flectool",
  ],
  authors: [{ name: "Flectool" }, { name: "Flectonis" }],
  creator: "Flectonis",
  metadataBase: new URL("https://flectool.app"),
  // title/description are deliberately omitted here. When the root declares them,
  // every page inherits the home page's og:title and og:description. Leaving them
  // out makes Next fall back to each page's own `title` / `description` above.
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://flectool.app",
    siteName: "Flectool",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@flectool",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Anti-FOUC script — runs before React hydration
const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('flectool_theme');
    if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch(e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
        <ThemeProvider>
          <ToastProvider>
            <LayoutClient>
              <main className="flex-1 pt-16">{children}</main>
            </LayoutClient>
            <Footer />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
