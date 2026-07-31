import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "@/styles/globals.css";
import { AISettingsProvider } from "@/shared";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadataBase = new URL("https://coursenva.vercel.app");

export const viewport: Viewport = {
  themeColor: "#f2f6f4",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "Coursenva — AI-Powered Free Course Finder & Learning Roadmaps",
    template: "%s | Coursenva",
  },
  description:
    "Discover high-quality free online courses from Coursera, edX, MIT OCW, YouTube, and Khan Academy. Build personalized career roadmaps and chat with an AI learning assistant.",
  keywords: [
    "free online courses",
    "AI course finder",
    "learning roadmap generator",
    "free programming courses",
    "Coursera free courses",
    "edX free courses",
    "MIT OpenCourseWare",
    "AI learning assistant",
    "Coursenva",
    "web development roadmap",
    "machine learning courses",
    "free certifications",
  ],
  authors: [{ name: "kuldeeprajput-dev" }],
  creator: "kuldeeprajput-dev",
  publisher: "Coursenva",
  alternates: {
    canonical: "https://coursenva.vercel.app",
  },
  openGraph: {
    title: "Coursenva — AI-Powered Free Course Finder & Learning Roadmaps",
    description:
      "Discover high-quality free online courses, build structured career roadmaps, and chat with an AI learning assistant.",
    url: "https://coursenva.vercel.app",
    siteName: "Coursenva",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Coursenva — AI-Powered Course Finder & Learning Roadmaps",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Coursenva — AI-Powered Free Course Finder & Learning Roadmaps",
    description:
      "Discover high-quality free online courses, build structured career roadmaps, and chat with an AI learning assistant.",
    images: ["/og-image.png"],
    creator: "@kuldeeprajput_dev",
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
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Coursenva",
  url: "https://coursenva.vercel.app",
  description:
    "AI-powered course search and custom roadmap generator using search grounding to find free educational resources across the web.",
  applicationCategory: "EducationalApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "kuldeeprajput-dev",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${playfair.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <AISettingsProvider>{children}</AISettingsProvider>
      </body>
    </html>
  );
}
