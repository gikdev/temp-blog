import type { Metadata } from "next";
import { Oxanium } from "next/font/google";
import "./globals.css";
import type { PropsWithChildren } from "react";

const oxanium = Oxanium({
  subsets: ["latin"],
  variable: "--font-oxanium",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Bahrami's Blog",
  description: "The place where I share my thoughts and knowledge.",
};

const className = `antialiased bg-neutral-950 text-neutral-400 ${oxanium.variable}`;

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={className}>
      <body>{children}</body>
    </html>
  );
}
