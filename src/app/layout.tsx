import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const description =
  "Grupos, partidos y bracket eliminatorio del Mundial 2026 en una vista.";

export const metadata: Metadata = {
  metadataBase: new URL("https://vermundial2026.vercel.app"),
  title: "Mundial 2026",
  description,
  openGraph: {
    title: "Mundial 2026",
    description,
    type: "website",
    locale: "es_MX",
    siteName: "Mundial 2026",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mundial 2026",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
