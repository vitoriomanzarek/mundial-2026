import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Mundial 2026",
  description:
    "Grupos, partidos y bracket eliminatorio del Mundial 2026 en una vista.",
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
      </body>
    </html>
  );
}
