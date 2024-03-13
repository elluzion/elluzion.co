import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { mainFont, monoFont } from "@/components/ui/providers/font-provider";
import PageHeader from "@/components/ui/single-use/PageHeader";
import CursorBacklight from "@/components/ui/single-use/CursorBacklight";
import { Toaster } from "@/components/ui/toaster";

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
      <body
        className={`${mainFont.variable} ${monoFont.variable} font-sans overflow-x-hidden`}
      >
        <CursorBacklight />
        <PageHeader />
        <Toaster />
        <div className="mb-4 px-4 md:px-0 pt-16 w-full max-w-[700px] transition-all self-center">
          {children}
        </div>
        {/* Vercel analytics */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
