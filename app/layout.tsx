import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  adjustFontFallback: false,
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
  preload: true,
  style: "normal",
});

export const metadata: Metadata = {
  title: "E-Summit 2026 | EDC BIT Mesra",
  description:
    "The official website of E-Summit 2026, organized by the Entrepreneurship Development Cell (EDC) of BIT Mesra. Join us for an exciting event filled with innovation, networking, and entrepreneurial opportunities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${interFont.variable} antialiased`}>{children}</body>
    </html>
  );
}
