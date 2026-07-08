import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mediusware SEO Intelligence Dashboard",
  description: "Comprehensive SEO intelligence platform for Mediusware — track market signals, competitor content, keyword rankings, AI search visibility, content pipeline, and performance metrics.",
  keywords: ["SEO", "Mediusware", "Intelligence Dashboard", "Keyword Research", "SERP Analysis", "Content Strategy", "AI Search"],
  authors: [{ name: "Mediusware" }],
  openGraph: {
    title: "Mediusware SEO Intelligence Dashboard",
    description: "Track market intelligence, competitor analysis, keyword rankings, and content performance in one place.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mediusware SEO Intelligence Dashboard",
    description: "Track market intelligence, competitor analysis, keyword rankings, and content performance in one place.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
