import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { profile } from "@/data/profile";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://anikdey.dev"),
  title: {
    default: "Anik Dey — Aspiring AI/ML Engineer | Portfolio",
    template: "%s | Anik Dey — Aspiring AI/ML Engineer",
  },
  description:
    "Portfolio of Anik Dey, Computer Science & Engineering undergraduate at Metropolitan University, Sylhet, Bangladesh, and aspiring AI/ML engineer working across Machine Learning, Deep Learning, NLP, Computer Vision, LLMs, and RAG.",
  keywords: [
    "Anik Dey",
    "Aspiring AI/ML Engineer",
    "AI Engineer",
    "Machine Learning",
    "Deep Learning",
    "Computer Vision",
    "NLP",
    "LLMs",
    "RAG",
    "Metropolitan University Sylhet",
    "CropPulse AI",
    "Moodline",
    "DocMind",
    "FocusBell AI",
    "StudyHub",
  ],
  authors: [{ name: "Anik Dey", url: "https://github.com/anikdey095" }],
  creator: "Anik Dey",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://anikdey.dev",
    title: "Anik Dey — Aspiring AI/ML Engineer",
    description:
      "Building practical AI systems across machine learning, deep learning, NLP, computer vision, and retrieval-augmented generation (RAG).",
    siteName: "Anik Dey Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anik Dey — Aspiring AI/ML Engineer",
    description:
      "Building practical AI systems across machine learning, deep learning, NLP, computer vision, and RAG.",
    creator: "@231Dey23536",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Anik Dey",
    url: "https://anikdey.dev",
    jobTitle: "Aspiring AI / ML Engineer",
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "Metropolitan University, Sylhet, Bangladesh",
    },
    knowsAbout: [
      "Artificial Intelligence",
      "Machine Learning",
      "Deep Learning",
      "Natural Language Processing",
      "Computer Vision",
      "Large Language Models",
      "Retrieval-Augmented Generation",
      "Agentic AI",
      "Python",
    ],
    sameAs: [
      "https://github.com/anikdey095",
      "https://www.linkedin.com/in/anik-dey-7723a4329/",
      "https://x.com/231Dey23536",
    ],
  };

  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]"
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
