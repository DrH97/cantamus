import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { siteConfig } from "@/data/site-config";
import "./globals.css";

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
    default: `${siteConfig.name} | Catholic Chorale from Nairobi, Kenya`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.musicalExpression,
  keywords: [
    "Cantamus",
    "Catholic choir",
    "Nairobi",
    "Kenya",
    "Gregorian chant",
    "African music",
    "Classical music",
    "Sacred music",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main className="min-h-screen pt-header">{children}</main>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
