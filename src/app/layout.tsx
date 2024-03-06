import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

import { mainFont, monoFont } from "@/components/ui/providers/font-provider";
import PageHeader from "@/components/ui/unique/PageHeader";
import CursorBacklight from "@/components/ui/unique/cursor-backlight";

import "./globals.css";

/**
 * The metadata tags of the page for SEO
 */
export const metadata: Metadata = {
  title: "Elluzion",
  description: "Software developer at day, music producer at night.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mainFont.variable} ${monoFont.variable}`}>
        <CursorBacklight />
        <PageHeader />
        <div className="mt-16 px-4 md:px-0 pt-16 w-full max-w-[700px] transition-all self-center">
          {children}
        </div>
        {/* Vercel analytics */}
        <Analytics />
      </body>
    </html>
  );
}
