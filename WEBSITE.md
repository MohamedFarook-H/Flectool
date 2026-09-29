# Flectool — Complete Website Documentation

> **Everything you need in one file:** what the site is, who owns it, every page, all 27 tools, the design system, the code architecture, how to run and deploy it, and what's still broken.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Branding & Ownership](#2-branding--ownership)
3. [Tech Stack](#3-tech-stack)
4. [Project Structure](#4-project-structure)
5. [Routes & Pages](#5-routes--pages)
6. [The 27 Tools](#6-the-27-tools)
7. [Design System](#7-design-system)
8. [Components](#8-components)
9. [State & Data Layer](#9-state--data-layer)
10. [SEO & Metadata](#10-seo--metadata)
11. [Local Storage Keys](#11-local-storage-keys)
12. [How to Run](#12-how-to-run)
13. [Deployment](#13-deployment)
14. [Known Issues & TODOs](#14-known-issues--todos)
15. [Appending a New Tool](#15-appending-a-new-tool)

---

## 1. Overview

| Field | Value |
|---|---|
| **Product name** | Flectool |
| **Company / brand owner** | Flectonis |
| **Contact email** | `flectonis@gmail.com` |
| **Production URL** | `https://flectool.app` |
| **Package name** | `flectool` |
| **Type** | Static (SSG) Next.js App Router site |
| **Tool count** | 27 across 6 categories |
| **Generated pages** | 42 |
| **Auth** | None — no login, no signup, no backend |
| **Data handling** | 100% client-side; files never leave the device |
| **License** | Private (`"private": true`) |

### What it is

Flectool is a free online utility suite — calculators, converters, and file processors that
run entirely in the user's browser. It targets four audiences: students, developers, content
creators, and ordinary people doing everyday math/file chores.

### Core value proposition

1. **Free** — no paywall, no account, no upsell.
2. **Private** — no uploads. Every file operation runs in-browser via Canvas, `pdf-lib`,
   `FileReader`, and Web Crypto.
3. **Fast** — fully static pages, lazy-loaded tool bundles, zero server round-trips.
4. **Accessible** — dark/light themes, keyboard-driven command palette, responsive layout.

---

## 2. Branding & Ownership

This is the most important distinction in the project:

| | Name | Role |
|---|---|---|
| **Product** | **Flectool** | The website and the tool suite users interact with |
| **Company** | **Flectonis** | The legal entity that builds, owns, and operates Flectool |

> The footer copyright reads `© 2026 Flectonis` — correct, because Flectonis is the company.
> The navbar logo reads `FLECTOOL` — correct, because Flectool is the product.

### Where Flectonis branding appears

- **Navbar** — `Powered by Flectonis` subtitle under the logo
- **Footer** — `© 2026 Flectonis. All rights reserved.` + `Powered By Flectonis`
- **Footer** — `About Flectonis` link → `/flectonis`
- **Footer** — mailto link to `flectonis@gmail.com`
- **Home page** — trust/feature section referencing the parent company
- **About page** — `Flectool is designed and developed by Flectonis` section
- **`/flectonis`** — dedicated company page (mission, philosophy, values, product, contact)
- **Metadata** — `creator: "Flectonis"`, `authors: ["Flectool", "Flectonis"]`

### Identity tokens

- Logo: 4-pointed sparkle/star SVG, indigo→cyan gradient, `strokeWidth 2.5`
- Wordmark: `FLECTOOL`, uppercase, `font-extrabold`, `tracking-tight`
- Tagline: **"Everything you need. One simple place."**
- Sub-tagline (navbar): `Utility Suite`

---

## 3. Tech Stack

### Framework

| Package | Version | Notes |
|---|---|---|
| `next` | `16.3.7` | App Router, Turbopack, fully static export-friendly |
| `react` / `react-dom` | `19.2.8` | |
| `typescript` | `^5` | `strict: true` |

### Styling

| Package | Version | Notes |
|---|---|---|
| `tailwindcss` | `^4` | CSS-first config via `@import "tailwindcss"` — **no `tailwind.config.js`** |
| `@tailwindcss/postcss` | `^4` | Wired through `postcss.config.mjs` |

> Tailwind v4 means theme customisation happens in CSS, not JS. All colors in this project
> are CSS variables consumed as `bg-[var(--card)]`, `text-[var(--muted-foreground)]`, etc.

### Functional dependencies

| Package | Version | Used by |
|---|---|---|
| `pdf-lib` | `^1.17.1` | JPG→PDF, PDF Merge, PDF Split, PDF Compressor |
| `qrcode` | `^1.5.4` | QR Code Generator |
| `@types/qrcode` | `^1.5.6` | dev-only types for the above |

### Dev tooling

- `eslint` `^9` with `eslint-config-next` (core-web-vitals + typescript)
- Fonts: `next/font/google` — **Geist** (`--font-geist-sans`) and **Geist Mono** (`--font-geist-mono`)

### Notable absences (intentional)

- **No icon library.** All icons are hand-rolled inline SVG inside `ToolIcon.tsx` (~30 cases).
- **No state library.** React `useState` + custom hooks only.
- **No CSS-in-JS.** Pure Tailwind utilities + CSS variables.
- **No analytics, no database, no API routes.**

---

## 4. Project Structure

```
toolora/                              (repo root — directory name not yet renamed)
├── AGENTS.md                         Next.js agent rules (auto-generated block)
├── CLAUDE.md                         @AGENTS.md
├── README.md                         ⚠ still default create-next-app boilerplate
├── WEBSITE.md                        ← this file
├── build-error.txt                   ⚠ stale artifact from an old failed build
├── eslint.config.mjs
├── next.config.ts                    empty config object
├── package.json
├── postcss.config.mjs
├── tsconfig.json                     path alias @/* → ./src/*
├── public/
│   ├── manifest.webmanifest    PWA manifest (name, theme, 3 icons, 4 shortcuts)
│   ├── icons/
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   ├── icon-maskable-512.png
│   │   └── apple-touch-icon.png
│   └── (⚠ unused Next.js defaults: file/globe/next/vercel/window.svg)
├── scripts/
│   └── generate_icons.py       regenerates public/icons/*.png (needs Pillow)
└── src/
    ├── app/
    │   ├── layout.tsx                root layout: fonts, metadata, theme script, providers
    │   ├── globals.css               CSS variables + glass utilities
    │   ├── page.tsx                  Home (398 lines)
    │   ├── tools/
    │   │   ├── page.tsx              server: metadata + <Suspense> boundary
    │   │   ├── ToolsClient.tsx       client: grid, category pills, ?filter= support
    │   │   └── [slug]/
    │   │       ├── page.tsx          server: static params + metadata
    │   │       └── ToolPageClient.tsx  client: lazy tool renderer, SEO content
    │   ├── category/[category]/page.tsx   per-category grid
    │   ├── about/page.tsx
    │   ├── contact/
    │   │   ├── page.tsx              server: metadata, layout, sidebar, icons
    │   │   └── ContactForm.tsx       client: fields, validation, mailto anchor
    │   ├── flectonis/page.tsx
    │   ├── privacy/page.tsx
    │   ├── terms/page.tsx
    │   ├── robots.ts               robots.txt
    │   └── sitemap.ts              sitemap.xml (40 URLs)
    ├── components/
    │   ├── layout/
    │   │   ├── LayoutClient.tsx      client wrapper: Navbar + CommandPalette + state
    │   │   ├── Navbar.tsx            (248 lines) brand, nav, category dropdowns, theme
    │   │   ├── CommandPalette.tsx    (188 lines) ⌘K fuzzy tool search
    │   │   ├── ThemeProvider.tsx     dark/light/system context
    │   │   └── Footer.tsx            (136 lines) 4-column link grid
    │   ├── tools/
    │   │   ├── student/      5 components
    │   │   ├── developer/    5 components
    │   │   ├── document/     4 components
    │   │   ├── image/        4 components
    │   │   ├── finance/      4 components
    │   │   └── everyday/     5 components
    │   └── ui/
    │       ├── ToolIcon.tsx         SVG icon renderer (name → SVG)
    │       ├── ToolCard.tsx         grid card
    │       ├── Button.tsx  Input.tsx  Badge.tsx  Toast.tsx
    ├── data/
    │   └── tools.ts                  849 lines — single source of truth
    ├── lib/
    │   └── contact.ts             contact constants, validate(), buildMailto() (no React)
    └── hooks/
        ├── useLocalStorage.ts
        ├── useFavorites.ts
        └── useRecentTools.ts
```

**Scale:** ~10,505 lines of TypeScript/TSX across 58 files.

---

## 5. Routes & Pages

### Route table

| Route | Type | Rendering | Purpose |
|---|---|---|---|
| `/` | `page.tsx` | Static | Home — hero, search, categories, featured, popular, recently used, trust/CTA |
| `/tools` | `page.tsx` | Static (client) | All 27 tools + per-category sections |
| `/tools/[slug]` | `page.tsx` | SSG ×27 | Individual tool: live widget, SEO copy, related tools, FAQ |
| `/category/[category]` | `page.tsx` | SSG ×6 | Category landing page with filtered grid |
| `/about` | `page.tsx` | Static | About Flectool — mission, categories, tech, privacy, Flectonis |
| `/flectonis` | `page.tsx` | Static | About Flectonis — company, philosophy, product, contact |
| `/contact` | `page.tsx` | Static | Contact — GitHub + email links, and a form that composes a `mailto:` |
| `/privacy` | `page.tsx` | Static | Privacy Policy |
| `/terms` | `page.tsx` | Static | Terms of Service |
| `/sitemap.xml` | `sitemap.ts` | Static | 40 URLs (7 pages + 6 categories + 27 tools) |
| `/robots.txt` | `robots.ts` | Static | Allow all, points at the sitemap |
| `/_not-found` | — | Static | 404 |

**Total: 45 prerendered pages.**

### Page-by-page detail

#### `/` — Home
Client component with a live tool search box that filters `TOOLS` on name, category,
description, and keywords. Sections in order:

1. **Hero** — H1 "Everything you need. / One simple place." (gradient text) + tagline
2. **Inline search** — live dropdown of matching tools with icons and category names
3. **Category grid** — all 6 categories, each with icon, name, tagline, tool count
4. **Featured tools** — tools where `featured: true`
5. **Popular tools** — tools where `popular: true`
6. **Recently used** — from `localStorage` via `useRecentTools()`
7. **Trust / why-Flectool section** — privacy, speed, no-signup messaging
8. **CTA** — links to `/tools`

#### `/tools` — All Tools
Server component that wraps `ToolsClient` in `<Suspense>` (required for
`useSearchParams`) and exports its own metadata. `ToolsClient` renders:
- **Primary filter pills** — All Tools / Popular / My Favorites, driven by `?filter=`
- **Category pills** — All + 6 categories, with counts that respect the active filter
- **Sort** — Default / A–Z / Category
- An empty state with a helpful message for both "no favorites yet" and "no tools found"
- Selecting a filter calls `router.replace` so the URL stays shareable and bookmarkable

#### `/tools/[slug]` — Tool detail
Server component generates static params for all 27 slugs and per-page metadata.
Renders `ToolPageClient`, which:
- Lazily imports the matching tool component via a `toolComponents` map
- Registers the visit in `useRecentTools`
- Renders a favorite (heart) toggle
- Emits SEO long-form content from `tool.info`: `whatIs`, `howTo[]`, `features[]`,
  `formulaOrDetails`
- Renders 3 related tools via `getRelatedTools(slug, 3)`

#### `/category/[category]` — Category landing
Server component. Shows the category hero (icon, name, tagline, description) then a grid
of only that category's tools. Metadata title pattern: `{Category Name} Tools — Flectool`.

#### `/about`, `/flectonis`, `/privacy`, `/terms`
Long-form static marketing/legal pages, all themed with CSS variables.

#### `/contact` — Contact

Two-column layout on `lg`, stacked below that. Left: the form. Right (`lg:sticky`):
direct email + GitHub links, a "What to expect" list, and a Flectonis card.

**Files**

| File | Role |
|---|---|
| `src/app/contact/page.tsx` | Server component. Metadata, layout, sidebar. Defines the inline `GithubIcon` / `MailIcon` SVGs and the `FormSkeleton` fallback. |
| `src/app/contact/ContactForm.tsx` | `"use client"`. Holds form state and renders the fields. |
| `src/lib/contact.ts` | Framework-free logic: `CONTACT_EMAIL`, `GITHUB_URL`, `GITHUB_HANDLE`, `TOPICS`, `EMPTY_FORM`, `validate()`, `buildMailto()`. Pure and unit-testable. |

`src/lib/contact.ts` is deliberately free of React so the mailto formatting can be
verified on its own — the string it produces is exactly what the visitor's mail
client receives.

**Fields**

| Field | Required | Validation | Notes |
|---|---|---|---|
| `name` | yes | non-empty, ≥2 chars | `autoComplete="name"` |
| `email` | yes | `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/` | becomes the reply-to address in the email body |
| `topic` | no | — | 6 fixed options from `TOPICS` |
| `tool` | no | — | `<optgroup>` per category, options built from `TOOLS` — auto-updates with new tools |
| `message` | yes | non-empty, ≥10 chars | trimmed before sending |

**How the form sends.** There is no backend, so the submit control is a real
`<a href={mailto}>` rather than a `<button>`. The `mailto` is derived from
current state via `useMemo`, so the href is always in sync. On click:

- If `validate()` returns errors → `preventDefault()`, reveal the errors, no mail client opens.
- If valid → the browser opens the visitor's mail client with the recipient, subject and
  body already filled in; the confirmation banner appears.

Advantages of the anchor over `window.location.href = mailto`: it works without
JS navigation quirks, shows the target in the status bar, and can be
middle-clicked or copied.

**Email format produced**

```
To:      flectonis@gmail.com
Subject: [Flectool] {topic}[ — {tool}]

New message from the Flectool contact form
===========================================

Name:     {name}
Email:    {email}
Topic:    {topic}
Tool:     {tool or "Not specified"}

Message
-------
{message}

===========================================
Sent from flectool.app/contact
Flectool is a product of Flectonis.
```

Subject and body are `encodeURIComponent`-encoded, so newlines, `& ? # < >`
and non-ASCII characters all survive the round trip. The trailing `— {tool}`
is omitted when no tool is selected, so the subject never has a dangling dash.

**UX notes**
- Errors stay hidden until the first submit attempt, so the form doesn't
  complain while you're still typing (`submitted` flag).
- The CTA greys out and reads "Fill in the required fields" while invalid.
- Editing any field clears the success banner.
- Linked from the Navbar (4th item) and the Footer "Company" column.

**Trade-off worth knowing:** `mailto:` depends on the visitor having a mail
client configured, and some webmail-only users see nothing happen. The
confirmation banner covers this by pointing at the direct `flectonis@gmail.com`
link in the same panel. If delivery reliability matters more than having zero
backend, swap `buildMailto` for a `fetch` to a form service (Formspree, Resend)
— the validation and field set stay exactly as they are.

---

## 6. The 27 Tools

Single source of truth: `src/data/tools.ts`.

### Student Tools (5) — icon `GraduationCap`, blue→indigo gradient

| Slug | Name | Icon | Flags | Description |
|---|---|---|---|---|
| `attendance-calculator` | Attendance Calculator | `CheckCircle2` | featured, popular, "Popular" | How many classes to attend/skip for a target % |
| `cgpa-calculator` | CGPA Calculator | `GraduationCap` | featured, popular, "Essential" | Weighted CGPA/GPA with credits, 10.0 & 4.0 scales |
| `percentage-calculator` | Percentage Calculator | `Percent` | popular | Marks %, X% of Y, % change, difference |
| `marks-calculator` | Marks Calculator | `Calculator` | — | Subject-wise aggregate, %, division |
| `age-calculator` | Age Calculator | `Calendar` | popular | Exact age + next-birthday countdown + milestones |

### Developer Tools (5) — icon `Code2`, emerald→teal gradient

| Slug | Name | Icon | Flags | Description |
|---|---|---|---|---|
| `json-formatter` | JSON Formatter | `Braces` | featured, popular, "Popular" | Format/validate/minify JSON |
| `base64-converter` | Base64 Encoder / Decoder | `Binary` | popular | Two-way Base64 for text and files |
| `url-encoder` | URL Encoder / Decoder | `Link` | — | Percent-encoding + query param parser |
| `uuid-generator` | UUID Generator | `KeyRound` | popular | RFC 4122 v4, batch up to 100 |
| `password-generator` | Password Generator | `ShieldCheck` | featured, popular, "Security" | Crypto-random passwords + entropy meter |

### Document Tools (4) — icon `FileText`, rose→pink gradient

| Slug | Name | Icon | Flags | Description |
|---|---|---|---|---|
| `jpg-to-pdf` | JPG to PDF | `FileImage` | featured, popular, "Client-Side" | Images → single PDF (pdf-lib) |
| `pdf-merge` | PDF Merge | `Layers` | popular, "Private" | Combine multiple PDFs |
| `pdf-split` | PDF Split | `Scissors` | — | Extract pages/ranges from a PDF |
| `pdf-compressor` | PDF Compressor | `FileArchive` | "Client-Side" | Shrink PDF size with before/after metrics |

### Image Tools (4) — icon `Image`, amber→orange gradient

| Slug | Name | Icon | Flags | Description |
|---|---|---|---|---|
| `image-compressor` | Image Compressor | `Minimize2` | featured, popular, "Popular" | Canvas-based quality compression |
| `image-resizer` | Image Resizer | `Scaling` | popular | Px/percent scaling + aspect lock + presets |
| `image-converter` | Image Converter | `RefreshCw` | — | JPG ⇄ PNG ⇄ WebP |
| `image-cropper` | Image Cropper | `Crop` | popular | Crop + rotate + flip with ratio presets |

### Finance Tools (4) — icon `BadgePercent`, cyan→sky gradient

| Slug | Name | Icon | Flags | Description |
|---|---|---|---|---|
| `emi-calculator` | EMI Calculator | `Coins` | featured, popular, "Popular" | Loan EMI + interest donut chart |
| `sip-calculator` | SIP Calculator | `TrendingUp` | popular, "Wealth" | Compound SIP growth projection |
| `gst-calculator` | GST Calculator | `Receipt` | — | Inclusive/exclusive GST + CGST/SGST split |
| `discount-calculator` | Discount Calculator | `Tag` | — | Stacked coupons + tax + final price |

### Everyday Tools (5) — icon `Wrench`, violet→fuchsia gradient

| Slug | Name | Icon | Flags | Description |
|---|---|---|---|---|
| `qr-generator` | QR Code Generator | `QrCode` | featured, popular, "Popular" | URL/text/Wi-Fi/email/phone QR, colored, high-res |
| `unit-converter` | Unit Converter | `ArrowLeftRight` | popular, "Multi-Unit" | 8 categories: length, weight, temp, area, volume, speed, data, time |
| `date-calculator` | Date Calculator | `CalendarDays` | — | Days between dates + business-day counting |
| `time-zone-converter` | Time Zone Converter | `Clock` | — | World clocks + meeting-hour slider |
| `text-counter` | Text Counter & Analyzer | `FileCode` | popular, "Writer" | Words, chars, read time, keyword frequency |

### Category counts

```
Student 5 · Developer 5 · Document 4 · Image 4 · Finance 4 · Everyday 5  =  27
```

### `ToolDefinition` interface

```ts
interface ToolDefinition {
  slug: string;            // URL segment, unique
  name: string;            // display name
  category: ToolCategory;  // one of the 6 keys
  description: string;     // card blurb
  icon: string;            // ToolIcon case name (NOT an emoji)
  keywords: string[];      // search + SEO
  featured?: boolean;      // home "Featured" section
  popular?: boolean;       // home "Popular" section
  badge?: string;          // small pill on the card ("Popular", "Security", …)
  seoTitle: string;        // page <title>  → now ends "| Flectool"
  seoDescription: string;  // meta description
  info: {
    whatIs: string;            // long-form intro for the tool page
    howTo: string[];           // numbered steps
    features: string[];        // bullet list
    formulaOrDetails?: string; // formula box
  };
}
```

### Data helper functions

| Function | Returns |
|---|---|
| `getToolBySlug(slug)` | `ToolDefinition \| undefined` |
| `getToolsByCategory(category)` | filtered `ToolDefinition[]` |
| `getFeaturedTools()` | tools with `featured: true` |
| `getPopularTools()` | tools with `popular: true` |
| `getRelatedTools(slug, count = 3)` | same-category first, then popular filler |

---

## 7. Design System

All colors are CSS variables. No hardcoded `slate-*` / `white` / `black` classes remain in
`src/` — this is what makes the dark theme work everywhere.

### Variables (`src/app/globals.css`)

| Variable | Light | Dark |
|---|---|---|
| `--background` | `#f8fafc` | `#07090e` |
| `--foreground` | `#0f172a` | `#f8fafc` |
| `--card` | `#ffffff` | `rgba(15,20,32,.75)` |
| `--card-foreground` | `#0f172a` | `#f8fafc` |
| `--card-border` | `rgba(15,23,42,.08)` | `rgba(255,255,255,.08)` |
| `--card-hover-border` | `rgba(79,70,229,.35)` | `rgba(129,140,248,.4)` |
| `--muted` | `#f1f5f9` | `rgba(255,255,255,.05)` |
| `--muted-foreground` | `#64748b` | `#94a3b8` |
| `--primary` | `#4f46e5` | `#6366f1` |
| `--primary-foreground` | `#ffffff` | `#ffffff` |
| `--primary-hover` | `#4338ca` | `#4f46e5` |
| `--secondary` | `#2563eb` | `#38bdf8` |
| `--accent` | `#06b6d4` | `#22d3ee` |
| `--border` | `#e2e8f0` | `rgba(255,255,255,.1)` |
| `--glass-bg` | `rgba(255,255,255,.85)` | `rgba(11,15,25,.8)` |
| `--glass-border` | `rgba(255,255,255,.6)` | `rgba(255,255,255,.1)` |
| `--glass-shadow` | `rgba(31,38,135,.07)` | `rgba(0,0,0,.45)` |
| `--ring` | `rgba(79,70,229,.25)` | `rgba(99,102,241,.35)` |

Defined twice: once under `:root`, once under `.dark`. The `.dark` class is toggled on
`<html>`.

### Custom utility classes

| Class | Effect |
|---|---|
| `.glass-panel` | Blur-16 glass surface with border + shadow |
| `.glass-nav` | Blur-20 nav bar with bottom border |
| `.glass-card` | Glass card; on hover lifts `-2px` and tints the border |
| `.bg-grid-pattern` | Faint 32×32 grid lines behind the hero |
| `.tabular-nums` | Tabular figures for financial tables |
| `::-webkit-scrollbar` | Custom 8px rounded scrollbar |

### Theme switching

1. An **anti-FOUC inline script** in `layout.tsx <head>` runs before hydration, reads
   `localStorage.flectool_theme`, and adds/removes `.dark` on `<html>` immediately.
2. `ThemeProvider` then hydrates React state from the same key and listens to
   `prefers-color-scheme` changes while in `system` mode.
3. `<html>` carries `suppressHydrationWarning` to avoid mismatch errors.

### Category color gradients

| Category | Icon tile gradient | Card gradient |
|---|---|---|
| student | `from-blue-500 to-indigo-600` | `from-blue-500/10 via-indigo-500/10 to-violet-500/10` |
| developer | `from-emerald-500 to-teal-600` | `from-emerald-500/10 via-teal-500/10 to-cyan-500/10` |
| document | `from-rose-500 to-pink-600` | `from-rose-500/10 via-pink-500/10 to-purple-500/10` |
| image | `from-amber-500 to-orange-600` | `from-amber-500/10 via-orange-500/10 to-red-500/10` |
| finance | `from-cyan-500 to-blue-600` | `from-cyan-500/10 via-sky-500/10 to-blue-500/10` |
| everyday | `from-violet-500 to-fuchsia-600` | `from-violet-500/10 via-fuchsia-500/10 to-pink-500/10` |

### Typography

- Body: Geist via `next/font/google`, exposed as `--font-geist-sans`
- Mono: Geist Mono as `--font-geist-mono`
- Wordmark: `font-extrabold tracking-tight`, uppercase
- Display sizes: `text-4xl md:text-5xl` (page H1), `text-5xl sm:text-6xl md:text-7xl` (home H1)

### Layout conventions

- Page container: `max-w-6xl` / `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Cards: `rounded-3xl` on marketing, `rounded-2xl` on tool panels, `rounded-xl` on inputs
- `main` has `pt-16` to clear the fixed 64px navbar
- Body is a flex column so the footer pins to the bottom

---

## 8. Components

### Layout components

#### `LayoutClient.tsx`
Client wrapper needed because `layout.tsx` is a **server** component but `Navbar` and
`CommandPalette` need shared `paletteOpen` state. Owns `useState` for the palette and
passes `onOpenSearch` / `onClose` down.

#### `Navbar.tsx` (249 lines)
- Brand block: logo tile + `FLECTOOL` + `Utility Suite` + `Powered by Flectonis`
- Desktop nav: Home / All Tools / About / Contact + Categories dropdown
- Categories dropdown (desktop) and slide-down panel (mobile), built from `CATEGORIES`
- Search button that opens the command palette
- Theme toggle wired to `useTheme().toggleTheme`
- "Explore Tools" CTA button (desktop only)
- Mobile sheet lists all 4 nav links in a 2×2 grid, then the 6 categories

#### `CommandPalette.tsx` (188 lines)
- ⌘K / Ctrl+K overlay
- Live filter over `TOOLS` matching name, category, description, and keywords (case-insensitive)
- Keyboard navigation + Enter to navigate
- Click-outside to close
- Searches **tools only** — static pages are not in the palette

#### `ThemeProvider.tsx`
Context with `{ theme, resolvedTheme, setTheme, toggleTheme }`.
Themes: `dark | light | system`. Persists to `localStorage` under `flectool_theme`.
`useTheme()` throws if used outside the provider.

#### `Footer.tsx` (141 lines)
Four columns: brand blurb, Platform, Tool Categories, Company. The Company column holds
About Flectool, About Flectonis, Contact, `flectonis@gmail.com`, Privacy Policy, Terms.
Bottom bar with `© 2026 Flectonis` and `Powered By Flectonis`.

### UI components

#### `ToolIcon.tsx` (301 lines)
Renders an SVG from a **name string** (e.g. `"QrCode"`), wrapped in a category-coloured
gradient tile. A `switch` maps 38 name cases to inline SVG paths with a `Wrench` default.
Icons are referenced by name in `tools.ts` — **never** rendered as raw text or emoji.

Props: `name`, `category?` (default `everyday`), `className?` (default `w-5 h-5`),
`tile?` (default `true`), `tileClassName?` (default `p-2.5`).

- `tile={false}` returns the bare `<svg>` with no wrapper — used on the about/flectonis
  value cards and the contact "What to expect" list, where the caller supplies its own
  muted rounded square and `text-[var(--primary)]` colour.
- `tileClassName` overrides the tile padding when the tile **is** used.

The 38 cases: the 32 original tool/category icons (`CheckCircle2`, `GraduationCap`,
`Percent`, `Calculator`, `Calendar`, `CalendarDays`, `Braces`, `Binary`, `Link`, `KeyRound`,
`ShieldCheck`, `FileImage`, `Image`, `Layers`, `Scissors`, `FileArchive`, `FileText`,
`Minimize2`, `Scaling`, `RefreshCw`, `Crop`, `Coins`, `BadgePercent`, `TrendingUp`,
`Receipt`, `Tag`, `QrCode`, `ArrowLeftRight`, `Clock`, `FileCode`, `Code2`, `Wrench`)
plus 6 concept icons added for the value cards: `Lock`, `Zap`, `Gift`, `Hammer`, `Globe`,
`Users`.

**When adding an icon:** add a `case` here *and* a matching `icon:` value in the data.
A name with no `case` silently falls back to `Wrench`, so a typo is easy to miss.

#### `ToolCard.tsx`
Props: `tool`, `showCategory?`. Shows the gradient icon tile, name, description, optional
category label and badge, and a favorite toggle.

#### `Button.tsx` / `Input.tsx` / `Badge.tsx` / `Toast.tsx`
Small theme-aware primitives. `Toast.tsx` exports `ToastProvider` (mounted in the root
layout) for transient notifications.

---

## 9. State & Data Layer

### `src/data/tools.ts` — the single source of truth
Everything about the site catalogue lives here: categories, tools, SEO copy, long-form
descriptions, and the helper functions. Adding a tool means editing this file plus adding a
component plus registering it in `ToolPageClient`.

### Hooks

#### `useLocalStorage<T>(key, initialValue)`
SSR-safe two-way binding.
- Reads on mount only, guarded by `try/catch`
- Returns `initialValue` until mounted → **no hydration mismatch**
- `setValue` is wrapped in `useCallback` and reads current state through a ref, which
  prevents the infinite re-render loop that a naive implementation causes

#### `useFavorites()`
Backed by `useLocalStorage`. Exposes `favorites`, `isFavorite(slug)`, `toggleFavorite(slug)`,
`removeFavorite(slug)`. All callbacks memoised so they are safe in `useEffect` deps.

#### `useRecentTools()`
Backed by `useLocalStorage`. Exposes `recents` (`{ slug, visitedAt }[]`), `addRecent`,
`clearRecents`, `removeRecent`. Capped at `MAX_RECENTS = 8`, most-recent-first.

### Provider nesting

```
<html>
└── <body>
    └── ThemeProvider
        └── ToastProvider
            ├── LayoutClient        (Navbar + CommandPalette)
            │   └── <main>          (page content)
            └── Footer
```

---

## 10. SEO & Metadata

### Root metadata (`layout.tsx`)

- `title.default`: `Flectool — Everything you need. One simple place.`
- `title.template`: `%s | Flectool`
- `description`: 27+ free tools, no login required
- `keywords`: free online tools, student tools, developer tools, image converter, pdf
  tools, unit converter, calculator, flectool
- `authors`: `Flectool`, `Flectonis`
- `creator`: `Flectonis`
- `metadataBase`: `https://flectool.app`
- OpenGraph: `type: "website"`, `locale: "en_US"`, `url: "https://flectool.app"`, `siteName: "Flectool"`
- Twitter: `card: "summary_large_image"`, `creator: "@flectool"`
- `robots`: index + follow, full preview permissions
- `viewport.themeColor`: `#ffffff` light / `#0a0a0f` dark

> **Do not add `openGraph.title` / `openGraph.description` to the root layout.** Next.js
> metadata is *inherited*, not merged, for nested fields: a child page that sets `title`
> but not `openGraph` keeps the parent's `og:title`. Hardcoding them at the root made every
> non-tool page share the home page's preview text when shared on social media. Omitting
> them lets Next fall back to each page's own `title` / `description`. `type`, `url`,
> `siteName`, `locale` and the Twitter `card` / `creator` are correct to keep at the root.

### Per-route metadata

| Route | Title pattern | Renders as |
|---|---|---|
| `/` | default title | `Flectool — Everything you need. One simple place.` |
| `/tools` | `All Tools` | `All Tools \| Flectool` |
| `/tools/[slug]` | `title: { absolute: "${seoTitle} \| Flectool" }` | `JSON Formatter & Validator — Beautify & Minify JSON \| Flectool` |
| `/category/[c]` | `cat.name` | `Student Tools \| Flectool` |
| `/about` | `About Flectool` | `About Flectool \| Flectool` |
| `/flectonis` | `Flectonis` | `Flectonis \| Flectool` |
| `/contact` | `Contact` | `Contact \| Flectool` |
| `/privacy` | `Privacy Policy` | `Privacy Policy \| Flectool` |
| `/terms` | `Terms of Service` | `Terms of Service \| Flectool` |

### `sitemap.ts` and `robots.ts`

`src/app/sitemap.ts` emits **40 URLs** at build time, all with the same
`lastModified` (the build date):

| Group | Count | `changeFrequency` | `priority` |
|---|---|---|---|
| `/` | 1 | weekly | 1.0 |
| `/tools` | 1 | weekly | 0.9 |
| `/about` | 1 | monthly | 0.6 |
| `/flectonis` | 1 | monthly | 0.5 |
| `/contact` | 1 | yearly | 0.5 |
| `/privacy`, `/terms` | 2 | yearly | 0.3 |
| `/category/[id]` | 6 | weekly | 0.8 |
| `/tools/[slug]` | 27 | monthly | 0.8 popular / 0.7 rest |

The static pages are a hand-maintained `STATIC_PAGES` array; categories and tools
are derived from `CATEGORIES` and `TOOLS`, so **new tools are picked up
automatically**. The only manual step when adding a *page* is adding it to
`STATIC_PAGES`.

`src/app/robots.ts` allows everything and points at `https://flectool.app/sitemap.xml`.
Note the sitemap hardcodes the `flectool.app` origin — change it in both
`sitemap.ts` and `robots.ts` if the domain changes.

> **Why some pages use `absolute`:** the root layout sets `template: "%s | Flectool"`, which
> automatically appends the suffix to any child page that returns a plain string. The tool
> pages use `{ absolute: ... }` instead, because their `seoTitle` values are edited directly
> in `tools.ts` and an absolute title is immune to the template. **Do not put `| Flectool`
> inside a `seoTitle`** — that was the cause of the doubled-suffix bug.

### On-page SEO content
Each tool page renders long-form copy from `tool.info` — definition paragraph, numbered
how-to steps, feature bullets, and an optional formula box. This is the main organic
traffic surface alongside the 27 tool titles.

---

## 11. Local Storage Keys

| Key | Type | Written by | Purpose |
|---|---|---|---|
| `flectool_theme` | `"dark" \| "light" \| "system"` | `ThemeProvider` | Theme preference |
| `flectool_favorites` | `string[]` (slugs) | `useFavorites` | Starred tools |
| `flectool_recent_tools` | `{ slug, visitedAt }[]`, max 8 | `useRecentTools` | Recently visited |

No cookies. No server sessions. Nothing leaves the browser.

---

## 12. How to Run

```bash
# from the project root
npm install

npm run dev      # dev server  → http://localhost:3000  (Turbopack)
npm run build    # production build (45 static pages)
npm run start    # serve the production build
npm run lint     # eslint
```

### Project location

```
/home/farook/Documents/Projects/toolora
```

> The folder is still named `toolora` even though the package is `flectool`. Renaming it is
> optional but would avoid confusion.

### Environment

No `.env` files. No secrets. The site has no backend, so there is nothing to configure.

### Gotchas for this repo

- **Not a git repository** — there is no version history. Back up before large refactors.
- Do not run `pkill -9 -f "next"`; it kills the agent's own shell. Use
  `pkill -f "next-server"`, or just start `npm run dev` again in the background.
- `useSearchParams` cannot be used in a statically prerendered page without a Suspense
  boundary — this is why `/tools` search params were removed. Don't reintroduce them
  without wrapping in `<Suspense>`.
- Tailwind v4: adding a new theme color means editing `globals.css`, not a JS config.

---

## 13. Deployment

The site is fully static and can go on any static host.

### Vercel (easiest)
```bash
npx vercel
```
Nothing to configure — no env vars, no build overrides.

### Static export (any CDN / nginx)
Add to `next.config.ts`:
```ts
const nextConfig: NextConfig = {
  output: "export",
};
```
Then `npm run build` emits a fully static `out/` directory.

### Before going live, fix
- [ ] Create the missing `public/manifest.webmanifest` and `public/icons/*` (see §14)
- [ ] Replace the placeholder `public/*.svg` Next.js defaults
- [ ] Confirm `flectool.app` DNS + TLS
- [ ] Submit `sitemap.xml` (not yet generated)
- [ ] Update the legal pages' "Last updated" date (currently January 2025)

---

## 14. Known Issues & TODOs

### Fixed on 30 Sep 2026

| Issue | Fix |
|---|---|
| Titles read `... \| Flectool \| Flectool` on all 27 tool pages — `seoTitle` carried a manual suffix *and* the root `title.template` appended another | Stripped the manual suffix from `seoTitle`; tool pages now use `title: { absolute: "\${seoTitle} \| Flectool" }` |
| Category titles read `Student Tools Tools — Flectool \| Flectool` — the code appended `" Tools"` to a `name` that already ends in "Tools" | Now `title: cat.name` → renders `Student Tools \| Flectool` |
| `/tools` had **no metadata at all** (silently inherited the home title) | `page.tsx` is now a server component exporting its own metadata |
| `manifest.webmanifest` + 3 icons 404'd on every page load | Added `public/manifest.webmanifest` and generated `public/icons/*.png` via `scripts/generate_icons.py` |
| Footer linked to `/tools?filter=popular` and `?filter=favorites`, but the filter feature had been stripped — both links were dead | Re-implemented the filter. `/tools/page.tsx` is a server component that wraps `ToolsClient` in `<Suspense>`, so `useSearchParams` works and the page still prerenders statically |
| `{tool.icon}` rendered as **raw text** (e.g. the literal string `QrCode`) in the header of all 27 tool pages | `ToolPageClient.tsx` now renders `<ToolIcon name={tool.icon} category={tool.category} />` |
| Emoji used as icons on `/`, `/category/[category]`, `/about` and `/flectonis` (duplicated per file, not read from `CATEGORIES`) | Deleted the duplicate emoji maps; all four now render `<ToolIcon>`. Added 6 missing `ToolIcon` cases — `Lock`, `Zap`, `Gift`, `Hammer`, `Globe`, `Users` — plus a `tile={false}` prop for use outside a gradient tile. 38 cases total, zero emoji left in those files |
| Hardcoded category list on `/flectonis` duplicated labels, icons and `"5 tools"` counts — would silently drift | Derived from `CATEGORIES` + `TOOLS`; only the short blurbs stay hand-written |
| `category={key as any}` type escape in `about/page.tsx` | `category={cat.id}` — already typed `ToolCategory` |
| No `sitemap.xml` / `robots.txt` | Added `src/app/sitemap.ts` (40 URLs) and `src/app/robots.ts` |
| Social share previews showed the **home page's** title on every non-tool page — root `openGraph.title` is inherited, not merged | Removed `title`/`description` from the root `openGraph` and `twitter` blocks so Next derives them per page. Verified `og:title` now matches each page's `<title>` on all 40 pages |
| This doc's own "add a new tool" example showed `seoTitle: "... | Flectool"`, contradicting the no-suffix rule | Corrected to `"My New Tool — Does Something Great"` |

### Still open

| Issue | Notes |
|---|---|
| Default Next.js SVGs in `public/` | `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` are unused scaffolding — safe to delete |
| `README.md` | Still create-next-app boilerplate. Replace or delete |
| `build-error.txt` | Stale artifact from an old failed build — the build passes. Safe to delete |
| Folder name `toolora/` | Still the old brand name |
| No Open Graph share image | `summary_large_image` is declared but no image exists, so link previews render without artwork |
| Legal pages dated "January 2025" | Update the "Last updated" line on `/privacy` and `/terms` |
| `next.config.ts` is empty | No image domains, redirects, or headers configured |
| Contact form uses `mailto:` | No backend, so delivery depends on the visitor having a mail client. The confirmation banner points at the direct email link as a fallback. Swap `buildMailto` for a `fetch` to Formspree/Resend if hard delivery matters — validation and fields stay as they are |
| Command palette ignores pages | ⌘K searches `TOOLS` only; `/contact`, `/about` etc. are not findable from it |

### Note on `useSearchParams`

`/tools` uses `useSearchParams` inside `ToolsClient`. This only prerenders statically
because `page.tsx` wraps it in `<Suspense>`. **Removing that boundary will break the
build** — this is exactly the failure that originally caused the filter to be deleted.

---

## 15. Appending a New Tool

Four edits. All four are required or the tool won't render.

**1. Create the component** in the right category folder:

```
src/components/tools/<category>/<Name>.tsx
```

Export it as a **named export** matching the component name:

```tsx
"use client";
export function MyNewTool() { /* ... */ }
```

Use CSS variables for every color — `bg-[var(--card)]`, `text-[var(--foreground)]`,
`border-[var(--border)]`, `text-[var(--muted-foreground)]`. Never hardcode `slate-*` or
`white`/`black`, or the dark theme breaks.

**2. Register the tool** in `src/data/tools.ts`:

```ts
{
  slug: "my-new-tool",              // must match the registry key below
  name: "My New Tool",
  category: "developer",
  description: "One-line card blurb.",
  icon: "Wrench",                   // must exist as a case in ToolIcon.tsx
  keywords: ["my", "new", "tool"],
  seoTitle: "My New Tool — Does Something Great",   // no "| Flectool" suffix
  seoDescription: "Full meta description, 150–160 characters.",
  info: {
    whatIs: "Long-form definition paragraph for the tool page.",
    howTo: ["Step one.", "Step two.", "Step three."],
    features: ["Feature one.", "Feature two."],
    formulaOrDetails: "Optional formula string.",
  },
}
```

**3. Register the component** in `src/app/tools/[slug]/ToolPageClient.tsx`:

```ts
"my-new-tool": lazyNamed(
  () => import("@/components/tools/developer/MyNewTool"),
  "MyNewTool"                        // must match the named export
),
```

**4. Rebuild and verify:**

```bash
npm run build
```

Confirm the new page appears in the route list under `/tools/[slug]`.

> `generateStaticParams` reads from `TOOLS` automatically, so no change is needed there.

---

## Quick Reference Card

```
Product      Flectool
Company      Flectonis
Email        flectonis@gmail.com
URL          https://flectool.app
Tools        27 in 6 categories
Pages        42 static
Framework    Next.js 16.3.7 (App Router, Turbopack)
Styling      Tailwind CSS v4 + CSS variables
Runtime      100% client-side, no backend
Build        npm run build
Dev          npm run dev  →  localhost:3000
```

---

*Last updated: 30 September 2026 — documents the working tree as of the Toolora → Flectool
rebrand. Build verified: 42 pages generated, 0 errors.*
