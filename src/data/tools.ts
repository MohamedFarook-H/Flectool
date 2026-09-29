export type ToolCategory =
  | "student"
  | "developer"
  | "document"
  | "image"
  | "finance"
  | "everyday";

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  gradient: string;
  borderGlow: string;
}

export const CATEGORIES: Record<ToolCategory, CategoryInfo> = {
  student: {
    id: "student",
    name: "Student Tools",
    tagline: "Study smarter and calculate faster",
    description: "Calculators and academic utilities designed for students, educators, and university life.",
    icon: "GraduationCap",
    gradient: "from-blue-500/10 via-indigo-500/10 to-violet-500/10",
    borderGlow: "hover:border-indigo-500/40",
  },
  developer: {
    id: "developer",
    name: "Developer Tools",
    tagline: "Small utilities that make coding easier",
    description: "Fast, privacy-friendly formatting, encoding, and code-generation tools built for modern developers.",
    icon: "Code2",
    gradient: "from-emerald-500/10 via-teal-500/10 to-cyan-500/10",
    borderGlow: "hover:border-teal-500/40",
  },
  document: {
    id: "document",
    name: "Document Tools",
    tagline: "Work with documents without installing software",
    description: "Client-side PDF creation, merging, splitting, and compression running 100% locally in your browser.",
    icon: "FileText",
    gradient: "from-rose-500/10 via-pink-500/10 to-purple-500/10",
    borderGlow: "hover:border-rose-500/40",
  },
  image: {
    id: "image",
    name: "Image Tools",
    tagline: "Resize, compress and convert images instantly",
    description: "Browser-powered image optimization, cropping, and conversion without cloud uploads.",
    icon: "Image",
    gradient: "from-amber-500/10 via-orange-500/10 to-red-500/10",
    borderGlow: "hover:border-amber-500/40",
  },
  finance: {
    id: "finance",
    name: "Finance Tools",
    tagline: "Simple calculators for everyday financial planning",
    description: "Interactive calculators for loans, investments, taxes, and smart shopping decisions.",
    icon: "BadgePercent",
    gradient: "from-cyan-500/10 via-sky-500/10 to-blue-500/10",
    borderGlow: "hover:border-cyan-500/40",
  },
  everyday: {
    id: "everyday",
    name: "Everyday Tools",
    tagline: "Useful utilities for everyday tasks",
    description: "Everyday essentials like QR generation, unit conversions, date math, text analysis, and time zones.",
    icon: "Wrench",
    gradient: "from-violet-500/10 via-fuchsia-500/10 to-pink-500/10",
    borderGlow: "hover:border-violet-500/40",
  },
};

export interface ToolDefinition {
  slug: string;
  name: string;
  category: ToolCategory;
  description: string;
  icon: string;
  keywords: string[];
  featured?: boolean;
  popular?: boolean;
  badge?: string;
  seoTitle: string;
  seoDescription: string;
  info: {
    whatIs: string;
    howTo: string[];
    features: string[];
    formulaOrDetails?: string;
  };
}

export const TOOLS: ToolDefinition[] = [
  // ================= STUDENT TOOLS =================
  {
    slug: "attendance-calculator",
    name: "Attendance Calculator",
    category: "student",
    description: "Find exactly how many classes you need to attend or can afford to miss to hit your target percentage.",
    icon: "CheckCircle2",
    keywords: ["attendance", "college", "school", "bunk", "classes", "percentage", "student", "criteria"],
    featured: true,
    popular: true,
    badge: "Popular",
    seoTitle: "Attendance Calculator — Target Percentage & Safe Bunks",
    seoDescription: "Calculate your current attendance percentage and find out how many classes you must attend or can safely miss to maintain 75% or your goal.",
    info: {
      whatIs: "An Attendance Calculator is an essential academic utility that computes your current class attendance percentage and mathematically predicts how many consecutive classes you need to attend or can safely skip while meeting minimum attendance thresholds.",
      howTo: [
        "Enter the total number of classes conducted so far.",
        "Enter the total number of classes you have attended.",
        "Set your minimum required attendance threshold (typically 75% or 85%).",
        "Review your current standing, remaining margin, and actionable advice.",
      ],
      features: [
        "Live interactive calculation without page reloads",
        "Shows exactly how many consecutive classes you need to attend",
        "Calculates safe bunk allowance if your attendance is above the threshold",
        "Visual attendance gauge with color-coded safety indicators",
      ],
      formulaOrDetails: "Current Attendance % = (Attended / Total) × 100. Target required: Need = ceil((Target × Total - 100 × Attended) / (100 - Target)).",
    },
  },
  {
    slug: "cgpa-calculator",
    name: "CGPA Calculator",
    category: "student",
    description: "Calculate your Cumulative Grade Point Average (CGPA) and Semester GPA with custom credit weights.",
    icon: "GraduationCap",
    keywords: ["cgpa", "gpa", "sgpa", "grades", "university", "credits", "transcript"],
    featured: true,
    popular: true,
    badge: "Essential",
    seoTitle: "CGPA & GPA Calculator — Weighted Grade Point Average",
    seoDescription: "Calculate semester GPA and overall cumulative CGPA with customizable credit hours and grading scales (10.0 or 4.0).",
    info: {
      whatIs: "A CGPA (Cumulative Grade Point Average) Calculator computes your weighted academic performance across all courses or semesters based on course credit hours and earned grade points.",
      howTo: [
        "Select your grading scale (10.0 or 4.0 system).",
        "Add your courses or semesters along with their credit values.",
        "Input the grade point or letter grade achieved for each.",
        "Check your instant weighted GPA/CGPA and percentage equivalent.",
      ],
      features: [
        "Supports dynamic course addition and removal",
        "Preset grading scales (10-point and 4-point systems)",
        "Calculates total credits and overall percentage equivalent",
        "Export and copy summary breakdown with one click",
      ],
      formulaOrDetails: "CGPA = Σ(Course Credits × Grade Points) / Σ(Total Course Credits).",
    },
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    category: "student",
    description: "Compute marks percentages, percentage increases/decreases, and ratios with instant precision.",
    icon: "Percent",
    keywords: ["percentage", "math", "marks", "ratio", "increase", "decrease", "fraction"],
    popular: true,
    seoTitle: "Percentage Calculator — Fast Marks & Change Calculator",
    seoDescription: "Calculate marks percentages, percentage increases/decreases, fraction conversion, and percentage differences instantly.",
    info: {
      whatIs: "The Percentage Calculator handles all standard percentage problems: what is X% of Y, marks obtained out of total, percentage change between two values, and fractional ratios.",
      howTo: [
        "Choose the calculation mode (Marks %, Value %, or Change %).",
        "Enter the base numbers.",
        "View step-by-step mathematical breakdown and final result.",
      ],
      features: [
        "Multiple calculation modes: Marks, Fraction, Change & Difference",
        "Shows clear formula steps and fractional conversions",
        "Instant one-click copy of the result",
      ],
      formulaOrDetails: "Percentage = (Obtained / Total) × 100. Percentage Change = ((New - Old) / Old) × 100.",
    },
  },
  {
    slug: "marks-calculator",
    name: "Marks Calculator",
    category: "student",
    description: "Add subject marks, practicals, and theoretical maximums to calculate total aggregate, percentage, and division.",
    icon: "Calculator",
    keywords: ["marks", "exam", "score", "grades", "subject", "aggregate", "division"],
    seoTitle: "Marks Calculator — Subject-Wise Exam Score & Division",
    seoDescription: "Calculate total exam marks, aggregate percentage, and academic division across multiple subjects with passing criteria.",
    info: {
      whatIs: "The Marks Calculator computes overall aggregate score, percentage, grade, and academic division across multiple subjects with optional practical and theory marks.",
      howTo: [
        "Add each subject with its obtained score and maximum marks.",
        "Optionally enter passing marks to track subject-level pass/fail.",
        "See overall aggregate, percentage, highest scoring subject, and overall performance grade.",
      ],
      features: [
        "Unlimited subject entries with custom naming",
        "Automatic division classification (First Division / Distinction / etc.)",
        "Subject-by-subject percentage breakdown",
      ],
    },
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    category: "student",
    description: "Find your exact chronological age in years, months, weeks, days, and countdown to your next birthday.",
    icon: "Calendar",
    keywords: ["age", "birthday", "birthdate", "chronological", "days old", "years old"],
    popular: true,
    seoTitle: "Age Calculator — Exact Age in Years, Months & Days",
    seoDescription: "Calculate exact chronological age from date of birth down to days and hours, with upcoming birthday countdown and life milestones.",
    info: {
      whatIs: "The Age Calculator determines exact chronological age between your birth date and today (or any target date), accounting for leap years and varying month lengths.",
      howTo: [
        "Select your date of birth.",
        "Optionally change the target date (defaults to today).",
        "Instantly view your age in years, months, and days, along with total days lived and countdown to next birthday.",
      ],
      features: [
        "Exact breakdown in years, months, weeks, days, and hours lived",
        "Days left until your next birthday with day of the week",
        "Fun milestone stats (heartbeats, breaths, sleep time estimates)",
      ],
    },
  },

  // ================= DEVELOPER TOOLS =================
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "developer",
    description: "Format, validate, beautify, and minify JSON data with instant syntax highlighting and error detection.",
    icon: "Braces",
    keywords: ["json", "format", "beautify", "minify", "validate", "lint", "prettify", "developer"],
    featured: true,
    popular: true,
    badge: "Popular",
    seoTitle: "JSON Formatter & Validator — Beautify & Minify JSON",
    seoDescription: "Format, validate, beautify, and minify JSON online. Fast client-side JSON editor with syntax error highlight, copy, and file download.",
    info: {
      whatIs: "JSON Formatter is a high-speed developer utility that parses, validates, and beautifies nested JSON data into readable indented structures or compact minified strings.",
      howTo: [
        "Paste your raw JSON into the editor or upload a .json file.",
        "Click Format (with 2 or 4 spaces) or Minify.",
        "View validation errors with exact line and column indicators if the JSON is invalid.",
        "Copy formatted output or download as a `.json` file.",
      ],
      features: [
        "Zero server latency: 100% in-browser processing",
        "Custom indentation (2 spaces, 4 spaces, tabs)",
        "Syntax error locator with clear diagnostic message",
        "Minify to single line for production payloads",
      ],
    },
  },
  {
    slug: "base64-converter",
    name: "Base64 Encoder / Decoder",
    category: "developer",
    description: "Encode text and files to Base64 format or decode Base64 strings back to readable UTF-8 text.",
    icon: "Binary",
    keywords: ["base64", "encode", "decode", "binary", "utf8", "developer", "crypto"],
    popular: true,
    seoTitle: "Base64 Encoder / Decoder — Text & File Base64 Tool",
    seoDescription: "Encode text and files to Base64 or decode Base64 data back to UTF-8 text with live real-time conversion in your browser.",
    info: {
      whatIs: "Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. This tool allows instant two-way encoding and decoding for text and file attachments.",
      howTo: [
        "Choose between Encode and Decode mode.",
        "Paste your string or drop a file.",
        "View live converted output with byte length and padding information.",
        "Copy or download the output.",
      ],
      features: [
        "Full UTF-8 unicode character support",
        "URL-safe base64 encoding option",
        "File to Base64 data URI converter",
        "Instant validation for valid base64 character sets",
      ],
    },
  },
  {
    slug: "url-encoder",
    name: "URL Encoder / Decoder",
    category: "developer",
    description: "Encode special characters for query strings and decode percent-encoded URLs with query parameter parsing.",
    icon: "Link",
    keywords: ["url", "encode", "decode", "uri", "percent-encoding", "query string", "http"],
    seoTitle: "URL Encoder & Decoder — Percent Encoding Tool",
    seoDescription: "Encode and decode URLs and URI query parameters with percent-encoding (`%20`, `%2F`) and interactive query string breakdown.",
    info: {
      whatIs: "URL encoding replaces unsafe ASCII characters with a % followed by two hexadecimal digits so they can be safely transmitted over HTTP query parameters.",
      howTo: [
        "Paste a URL or query parameter string.",
        "Switch between Encode and Decode modes.",
        "Inspect individual query parameter key-value pairs broken down automatically.",
      ],
      features: [
        "Encodes standard URI components (RFC 3986)",
        "Interactive URL parser displaying protocol, host, path, and query params",
        "Live bi-directional conversion",
      ],
    },
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    category: "developer",
    description: "Generate cryptographically secure RFC 4122 Version 4 UUIDs individually or in bulk batches.",
    icon: "KeyRound",
    keywords: ["uuid", "guid", "v4", "generator", "random", "unique", "rfc4122"],
    popular: true,
    seoTitle: "UUID Generator — Random UUID v4 & GUID Generator",
    seoDescription: "Generate cryptographically secure random UUID v4 / GUID strings. Batch generation up to 100, uppercase/lowercase, hyphens toggle, and copy.",
    info: {
      whatIs: "UUID (Universally Unique Identifier) Version 4 is a 128-bit identifier generated using cryptographically strong pseudo-random numbers with practically zero collision probability.",
      howTo: [
        "Choose how many UUIDs to generate (1 to 100).",
        "Toggle formatting options: uppercase, lowercase, hyphens, or braces.",
        "Click Generate New or Copy All.",
      ],
      features: [
        "Powered by browser `crypto.randomUUID()`",
        "Batch generation up to 100 unique UUIDs at once",
        "Customizable formatting: hyphens, uppercase, braces",
        "One-click copy all or individual item copy",
      ],
    },
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    category: "developer",
    description: "Create strong, cryptographically secure passwords and passphrases with entropy and crack-time metrics.",
    icon: "ShieldCheck",
    keywords: ["password", "generator", "secure", "passphrase", "crypto", "entropy", "random"],
    featured: true,
    popular: true,
    badge: "Security",
    seoTitle: "Strong Password Generator — Secure & Random Password Tool",
    seoDescription: "Generate strong, secure passwords with custom length, numbers, symbols, uppercase/lowercase, and live entropy strength calculation.",
    info: {
      whatIs: "The Password Generator creates unpredictable, cryptographically random passwords and passphrases in your browser, keeping your accounts safe from brute-force attacks.",
      howTo: [
        "Set your desired password length (8 to 64 characters).",
        "Toggle character groups: uppercase, lowercase, numbers, and symbols.",
        "Check the real-time strength meter and estimated crack time.",
        "Copy your secure password directly to your clipboard.",
      ],
      features: [
        "Uses hardware-grade `window.crypto.getRandomValues()`",
        "Strength rating with entropy bits and estimated crack resistance",
        "Avoid ambiguous characters option (e.g. 0/O, 1/l/I)",
        "Memorable passphrase generator mode",
      ],
    },
  },

  // ================= DOCUMENT TOOLS =================
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    category: "document",
    description: "Convert JPG, PNG, and WebP images into a single clean PDF document entirely within your browser.",
    icon: "FileImage",
    keywords: ["jpg to pdf", "image to pdf", "convert", "photos to pdf", "document", "pdf-lib"],
    featured: true,
    popular: true,
    badge: "Client-Side",
    seoTitle: "JPG to PDF Converter — Fast, Free & 100% Private",
    seoDescription: "Convert multiple JPG, PNG, and WebP images into a single PDF document. Drag and drop, reorder pages, adjust margins, and download instantly.",
    info: {
      whatIs: "JPG to PDF converts your digital photos and scans into a single, standardized PDF document without uploading your private files to an external server.",
      howTo: [
        "Drag and drop your images or click to select files.",
        "Reorder images by dragging them into your preferred sequence.",
        "Choose page orientation (Auto, Portrait, Landscape) and margin size.",
        "Click Generate PDF and download your file immediately.",
      ],
      features: [
        "100% private: runs locally via WebAssembly & `pdf-lib`",
        "Supports JPG, PNG, and WEBP image formats",
        "Custom margins (None, Small, Normal) and page orientations",
        "Reorder and delete pages before compiling",
      ],
    },
  },
  {
    slug: "pdf-merge",
    name: "PDF Merge",
    category: "document",
    description: "Combine multiple PDF files into one organized document in seconds without server uploads.",
    icon: "Layers",
    keywords: ["pdf merge", "combine pdf", "join pdf", "merge documents", "pdf-lib"],
    popular: true,
    badge: "Private",
    seoTitle: "Merge PDF Files Online — Combine PDFs Client-Side",
    seoDescription: "Merge multiple PDF files into one document for free. No file limits, no watermark, and completely private browser-side processing.",
    info: {
      whatIs: "PDF Merge combines two or more independent PDF documents into a single consolidated file while preserving bookmarks, fonts, and vector quality.",
      howTo: [
        "Select or drop multiple PDF files.",
        "Rearrange the order of the files using the move up/down controls.",
        "Click Merge PDFs to combine pages seamlessly.",
        "Save your newly merged PDF.",
      ],
      features: [
        "Zero server uploads: your sensitive files never leave your device",
        "Easy reordering of uploaded documents",
        "Retains crisp text quality and embedded graphics",
        "No arbitrary file size limits",
      ],
    },
  },
  {
    slug: "pdf-split",
    name: "PDF Split",
    category: "document",
    description: "Extract specific page ranges or split a large PDF into individual pages with one click.",
    icon: "Scissors",
    keywords: ["pdf split", "extract pages", "separate pdf", "cut pdf", "document"],
    seoTitle: "Split PDF Online — Extract Pages from PDF",
    seoDescription: "Extract specific pages or page ranges (e.g. 1-3, 5, 8-10) from any PDF document for free directly in your web browser.",
    info: {
      whatIs: "PDF Split lets you extract exact pages or page intervals from a multi-page PDF document without needing heavy desktop software like Adobe Acrobat.",
      howTo: [
        "Upload your PDF file.",
        "Specify the page range to extract (e.g., `1-4, 7, 10-12`) or choose to burst into individual pages.",
        "Click Split & Download to generate your customized PDF.",
      ],
      features: [
        "Flexible range syntax: comma-separated pages and hyphenated intervals",
        "Previews total page count and validated page selections",
        "Instant in-browser extraction",
      ],
    },
  },
  {
    slug: "pdf-compressor",
    name: "PDF Compressor",
    category: "document",
    description: "Optimize and compress PDF documents client-side to reduce file size for email and web uploads.",
    icon: "FileArchive",
    keywords: ["pdf compress", "reduce pdf size", "shrink pdf", "pdf optimizer", "document"],
    badge: "Client-Side",
    seoTitle: "Compress PDF Online — Reduce PDF File Size",
    seoDescription: "Reduce PDF file size directly in your browser. Optimize embedded images and document streams with transparent before/after size metrics.",
    info: {
      whatIs: "PDF Compressor optimizes document objects and downscales heavy embedded scans to minimize file size while preserving essential visual clarity.",
      howTo: [
        "Select your PDF file to analyze its initial file size.",
        "Select compression level (Recommended, Maximum, or High Quality).",
        "Process and compare the before and after file size savings.",
        "Download your compressed PDF.",
      ],
      features: [
        "Client-side canvas re-sampling and PDF stream optimization",
        "Transparent before vs after file size comparison",
        "No cloud queue or wait time",
      ],
    },
  },

  // ================= IMAGE TOOLS =================
  {
    slug: "image-compressor",
    name: "Image Compressor",
    category: "image",
    description: "Compress JPG, PNG, and WebP images up to 80% without noticeable quality loss using HTML5 Canvas.",
    icon: "Minimize2",
    keywords: ["image compressor", "shrink photo", "reduce photo size", "jpg compress", "png compress"],
    featured: true,
    popular: true,
    badge: "Popular",
    seoTitle: "Image Compressor — Compress JPG, PNG & WebP Online",
    seoDescription: "Compress images online without losing quality. Adjustable quality slider, live before/after size comparisons, and instant downloads.",
    info: {
      whatIs: "Image Compressor reduces digital image file sizes through intelligent lossy and lossless browser-based canvas compression, accelerating website load times and email attachments.",
      howTo: [
        "Upload any JPG, PNG, or WebP image.",
        "Adjust the quality slider to find your balance between file size and sharpness.",
        "Inspect the live size savings percentage.",
        "Download the optimized image.",
      ],
      features: [
        "Supports JPG, PNG, and WebP formats",
        "Live before and after file size comparison with % saved",
        "Adjustable quality slider with real-time preview",
        "100% in-browser processing",
      ],
    },
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    category: "image",
    description: "Resize images by exact pixel dimensions, percentage scale, or social media presets with aspect ratio lock.",
    icon: "Scaling",
    keywords: ["image resizer", "resize photo", "dimensions", "width", "height", "aspect ratio"],
    popular: true,
    seoTitle: "Image Resizer — Resize Photos by Dimensions or Percentage",
    seoDescription: "Resize images to custom width and height, lock aspect ratio, or choose popular presets (Avatar, Full HD, Instagram).",
    info: {
      whatIs: "Image Resizer scales image dimensions up or down using bicubic canvas interpolation, preserving sharpness while matching target screen and social media specifications.",
      howTo: [
        "Upload your image to load current dimensions.",
        "Enter target width or height with aspect ratio locked, or enter a scale percentage.",
        "Or pick a preset like Social Avatar (500x500) or Full HD (1920x1080).",
        "Download your resized image.",
      ],
      features: [
        "Aspect ratio lock prevents distortion",
        "Pixel (px) and percentage (%) scaling modes",
        "Presets for social media and HD wallpapers",
        "Fast client-side bicubic resampling",
      ],
    },
  },
  {
    slug: "image-converter",
    name: "Image Converter",
    category: "image",
    description: "Convert photos seamlessly between JPG, PNG, and WebP formats with transparency and quality controls.",
    icon: "RefreshCw",
    keywords: ["image converter", "png to jpg", "jpg to png", "webp converter", "photo format"],
    seoTitle: "Image Converter — Convert JPG, PNG & WebP Online",
    seoDescription: "Convert images between JPG, PNG, and WebP formats in seconds. High-fidelity canvas conversion with transparency preservation.",
    info: {
      whatIs: "Image Converter transforms image file formats (JPG to PNG, PNG to WebP, WebP to JPG) right in your browser, perfect for modern web optimization.",
      howTo: [
        "Upload the image you want to convert.",
        "Select your target format: JPG, PNG, or WebP.",
        "Adjust output quality if applicable.",
        "Download your converted image immediately.",
      ],
      features: [
        "Converts between JPG, PNG, and WebP formats",
        "Preserves PNG transparency or applies clean background for JPG",
        "Quality adjustment for lossy formats",
      ],
    },
  },
  {
    slug: "image-cropper",
    name: "Image Cropper",
    category: "image",
    description: "Crop, rotate, and flip photos with aspect ratio presets (1:1, 16:9, 4:3, freeform) and live preview.",
    icon: "Crop",
    keywords: ["image cropper", "crop photo", "cut image", "aspect ratio", "avatar crop"],
    popular: true,
    seoTitle: "Image Cropper — Crop Photos to Aspect Ratios",
    seoDescription: "Crop photos online with aspect ratio presets (Square 1:1, 16:9, 4:3, Freeform), 90° rotation, and instant high-res crop download.",
    info: {
      whatIs: "Image Cropper lets you trim unwanted edges, frame key subjects, and crop images to exact aspect ratios for profile pictures, thumbnails, and banners.",
      howTo: [
        "Upload the photo you want to crop.",
        "Select an aspect ratio preset or choose Freeform.",
        "Drag and resize the cropping frame over your image.",
        "Optionally rotate or flip your image.",
        "Click Crop & Download.",
      ],
      features: [
        "Interactive cropping frame with corner handles",
        "Standard aspect ratios: 1:1 (Avatar), 16:9 (Landscape), 4:3, 9:16 (Story)",
        "Rotate 90 degrees and flip controls",
        "Lossless canvas export",
      ],
    },
  },

  // ================= FINANCE TOOLS =================
  {
    slug: "emi-calculator",
    name: "EMI Calculator",
    category: "finance",
    description: "Calculate home, car, and personal loan monthly EMIs, total interest payable, and amortization breakdown.",
    icon: "Coins",
    keywords: ["emi", "loan", "mortgage", "car loan", "interest", "finance", "calculator"],
    featured: true,
    popular: true,
    badge: "Popular",
    seoTitle: "EMI Calculator — Loan EMI, Interest & Visual Chart",
    seoDescription: "Calculate loan EMI, total interest, and total payable amount with interactive visual breakdown chart for Home, Car, and Personal loans.",
    info: {
      whatIs: "An Equated Monthly Installment (EMI) Calculator determines the fixed payment amount made by a borrower to a lender at a specified date each calendar month.",
      howTo: [
        "Enter the principal loan amount.",
        "Input the annual interest rate percentage.",
        "Select your loan tenure in years or months.",
        "Inspect your monthly payment, interest vs principal breakdown chart, and total repayment sum.",
      ],
      features: [
        "Interactive visual donut chart showing Principal vs Interest",
        "Yearly and monthly tenure toggles",
        "Complete payment summary with total interest payable",
        "Copy or share calculation results with one click",
      ],
      formulaOrDetails: "EMI = [P × R × (1+R)^N] / [(1+R)^N - 1], where P = Principal, R = Monthly interest rate, N = Number of monthly installments.",
    },
  },
  {
    slug: "sip-calculator",
    name: "SIP Calculator",
    category: "finance",
    description: "Estimate future returns on Systematic Investment Plans (SIP) and mutual funds with compound growth projections.",
    icon: "TrendingUp",
    keywords: ["sip", "mutual fund", "investment", "compound interest", "wealth", "returns"],
    popular: true,
    badge: "Wealth",
    seoTitle: "SIP Calculator — Systematic Investment Plan Returns",
    seoDescription: "Calculate future wealth growth with our SIP Calculator. See invested amount, estimated compound returns, and final maturity corpus.",
    info: {
      whatIs: "A Systematic Investment Plan (SIP) Calculator calculates the potential wealth accumulation and compounding gains from regular monthly investments in mutual funds.",
      howTo: [
        "Enter your monthly investment amount.",
        "Set the expected annual rate of return (e.g., 12% to 15% for index/equity funds).",
        "Choose the investment duration in years.",
        "Review your total invested capital, estimated returns, and total maturity amount.",
      ],
      features: [
        "Compound growth visual breakdown chart",
        "Clear distinction between invested principal and wealth gained",
        "Lump sum vs monthly SIP comparison insights",
      ],
      formulaOrDetails: "M = P × [((1 + i)^n - 1) / i] × (1 + i), where P = Monthly investment, i = Monthly return rate, n = Total months.",
    },
  },
  {
    slug: "gst-calculator",
    name: "GST Calculator",
    category: "finance",
    description: "Calculate Goods and Services Tax (GST) with standard rate slabs, inclusive/exclusive pricing, and CGST/SGST splits.",
    icon: "Receipt",
    keywords: ["gst", "tax", "vat", "cgst", "sgst", "sales tax", "invoice"],
    seoTitle: "GST Calculator — Inclusive & Exclusive Tax Calculator",
    seoDescription: "Calculate GST amounts with 5%, 12%, 18%, and 28% tax slabs. Calculate GST-inclusive and GST-exclusive prices with CGST and SGST breakdown.",
    info: {
      whatIs: "The GST Calculator calculates tax additions (exclusive) or tax extractions (inclusive) along with central and state tax splits (CGST/SGST).",
      howTo: [
        "Enter your initial amount.",
        "Choose your GST rate percentage (preset slabs: 5%, 12%, 18%, 28%, or custom).",
        "Select whether the entered price is GST Inclusive or GST Exclusive.",
        "View exact tax amount, net price, and CGST/SGST distribution.",
      ],
      features: [
        "GST Inclusive and Exclusive modes",
        "Quick preset buttons for standard tax brackets",
        "Automatic 50/50 division into CGST and SGST",
      ],
      formulaOrDetails: "GST Exclusive: Tax = (Amount × Rate) / 100. GST Inclusive: Tax = Amount - [Amount × (100 / (100 + Rate))].",
    },
  },
  {
    slug: "discount-calculator",
    name: "Discount Calculator",
    category: "finance",
    description: "Find your final sale price, total savings, and double discount combinations for smart shopping.",
    icon: "Tag",
    keywords: ["discount", "sale", "shopping", "savings", "coupon", "black friday", "percent off"],
    seoTitle: "Discount Calculator — Calculate Sale Price & Savings",
    seoDescription: "Calculate exact sale prices, percent-off discounts, additional coupon stacking, and tax additions with total money saved.",
    info: {
      whatIs: "The Discount Calculator quickly computes how much money you save on sale items and the final price you will pay after primary discounts, coupons, and sales tax.",
      howTo: [
        "Enter the original retail price.",
        "Enter the discount percentage (e.g. 20% off).",
        "Optionally add an extra coupon discount or sales tax percentage.",
        "View your final price and total money saved.",
      ],
      features: [
        "Supports secondary stacked coupons and sales tax addition",
        "Visual savings progress indicator",
        "Shows exactly how much money remains in your wallet",
      ],
    },
  },

  // ================= EVERYDAY TOOLS =================
  {
    slug: "qr-generator",
    name: "QR Code Generator",
    category: "everyday",
    description: "Generate high-resolution custom QR codes for URLs, text, Wi-Fi networks, emails, and phone numbers.",
    icon: "QrCode",
    keywords: ["qr code", "qr generator", "wifi qr", "barcode", "vcard", "link qr"],
    featured: true,
    popular: true,
    badge: "Popular",
    seoTitle: "QR Code Generator — Free Custom QR Codes with Colors",
    seoDescription: "Create clean, scannable QR codes for websites, Wi-Fi connections, text, emails, and phone calls. Customize colors, size, and download high-res PNG.",
    info: {
      whatIs: "A QR (Quick Response) Code is a 2D optical barcode that can be scanned by any smartphone camera to open web links, connect to Wi-Fi networks, or access contact information.",
      howTo: [
        "Select your QR code data type: URL, Plain Text, Wi-Fi, Email, or Phone.",
        "Fill in the relevant details (e.g. Wi-Fi SSID and password).",
        "Customize foreground color, background color, and output size.",
        "Download your crisp PNG image immediately.",
      ],
      features: [
        "Specialized Wi-Fi QR mode: scan to join Wi-Fi without typing passwords",
        "Custom foreground and background color pickers",
        "Adjustable canvas resolution up to 1024px",
        "High error-correction level for maximum scannability",
      ],
    },
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    category: "everyday",
    description: "Convert units of length, weight, temperature, area, volume, speed, time, and digital data storage.",
    icon: "ArrowLeftRight",
    keywords: ["unit converter", "metric", "imperial", "length", "weight", "temperature", "converter"],
    popular: true,
    badge: "Multi-Unit",
    seoTitle: "Unit Converter — Convert Length, Weight, Temperature & More",
    seoDescription: "All-in-one unit converter for Metric and Imperial conversions: Length (km/miles), Weight (kg/lbs), Temperature (°C/°F), Volume, Speed, and Data.",
    info: {
      whatIs: "The Unit Converter provides immediate bi-directional conversion across the most common measurement systems in science, engineering, travel, and daily life.",
      howTo: [
        "Select your measurement category (Length, Weight, Temperature, Area, Volume, Speed, Data, Time).",
        "Enter a value in either input field.",
        "Select your 'From' and 'To' units.",
        "Read the converted result and reference formula.",
      ],
      features: [
        "8 comprehensive measurement categories",
        "Metric and Imperial support with high precision",
        "Quick unit swap button",
        "Formula display for educational reference",
      ],
    },
  },
  {
    slug: "date-calculator",
    name: "Date Calculator",
    category: "everyday",
    description: "Calculate exact days between two dates, add or subtract time, and count working business days.",
    icon: "CalendarDays",
    keywords: ["date calculator", "days between", "duration", "business days", "calendar math"],
    seoTitle: "Date Calculator — Days Between Dates & Business Days",
    seoDescription: "Calculate the exact duration between two dates in days, weeks, and months, or add/subtract days to find future and past dates.",
    info: {
      whatIs: "The Date Calculator determines elapsed time between two calendar dates or computes future and past dates by adding or subtracting specific intervals.",
      howTo: [
        "Choose 'Days Between Dates' or 'Add / Subtract Days'.",
        "Select your starting and ending dates.",
        "Optionally exclude Saturdays and Sundays to count working business days.",
        "View total days, weeks, and month breakdowns.",
      ],
      features: [
        "Two calculation modes: Difference between dates and Date offset",
        "Business days calculator excluding weekends",
        "Comprehensive duration breakdown (weeks, months, total days)",
      ],
    },
  },
  {
    slug: "time-zone-converter",
    name: "Time Zone Converter",
    category: "everyday",
    description: "Compare time across global cities, view world clocks, and plan international meetings with interactive sliders.",
    icon: "Clock",
    keywords: ["time zone", "world clock", "utc", "gmt", "meeting planner", "international time"],
    seoTitle: "Time Zone Converter & Meeting Planner",
    seoDescription: "Compare local times across world cities (New York, London, Tokyo, Dubai, Sydney). Interactive slider to plan cross-timezone meetings easily.",
    info: {
      whatIs: "The Time Zone Converter helps remote teams, travelers, and global collaborators compare local times across international time zones without confusion over daylight saving time.",
      howTo: [
        "Add the cities or time zones you want to compare.",
        "Drag the time slider to any hour of the day.",
        "See corresponding local times in all selected cities simultaneously.",
        "Green/yellow indicators highlight standard working hours (9 AM - 6 PM).",
      ],
      features: [
        "Interactive hour slider with instant synchronization across all clocks",
        "Working hours indicator (business hours vs evening/night)",
        "Preloaded with major world financial and technology hubs",
        "Live current time mode",
      ],
    },
  },
  {
    slug: "text-counter",
    name: "Text Counter & Analyzer",
    category: "everyday",
    description: "Analyze text for word count, character count, sentence structure, reading time, and keyword frequency.",
    icon: "FileCode",
    keywords: ["word counter", "character count", "reading time", "text analyzer", "keyword density"],
    popular: true,
    badge: "Writer",
    seoTitle: "Word Counter & Text Analyzer — Words, Characters & Reading Time",
    seoDescription: "Count words, characters with/without spaces, sentences, paragraphs, reading time, speaking time, and keyword density in real-time.",
    info: {
      whatIs: "Text Counter is a real-time prose and copy analysis tool that tracks length restrictions for essays, articles, social media posts, and speeches.",
      howTo: [
        "Type or paste your text into the analyzer.",
        "Watch live counters update as you type.",
        "Check estimated reading time (based on 200 wpm) and speaking time.",
        "Inspect top repeated keywords and character limits for Twitter/X, Instagram, and LinkedIn.",
      ],
      features: [
        "Counts words, characters with spaces, characters without spaces",
        "Counts sentences, paragraphs, and average word length",
        "Estimated reading time and speaking time calculators",
        "Top keyword frequency distribution table",
      ],
    },
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return TOOLS.filter((t) => t.category === category);
}

export function getFeaturedTools(): ToolDefinition[] {
  return TOOLS.filter((t) => t.featured);
}

export function getPopularTools(): ToolDefinition[] {
  return TOOLS.filter((t) => t.popular);
}

export function getRelatedTools(currentSlug: string, count: number = 3): ToolDefinition[] {
  const current = getToolBySlug(currentSlug);
  if (!current) return TOOLS.slice(0, count);

  // First try tools in the same category
  const sameCategory = TOOLS.filter(
    (t) => t.category === current.category && t.slug !== currentSlug
  );

  if (sameCategory.length >= count) {
    return sameCategory.slice(0, count);
  }

  // Supplement with popular tools
  const others = TOOLS.filter(
    (t) => t.slug !== currentSlug && !sameCategory.includes(t)
  );

  return [...sameCategory, ...others].slice(0, count);
}
