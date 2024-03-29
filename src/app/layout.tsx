import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";

import CursorBacklight from "@/app/_components/CursorBacklight";
import PageToolbar from "@/app/_components/PageToolbar";
import { Toaster } from "@/components/toaster";
import { mainFont, monoFont } from "@/lib/fonts/font-provider";

import "./globals.css";

/**
 * The metadata tags of the page for SEO
 */
export const metadata: Metadata = {
  title: "Elluzion",
  description: "German EDM producer",
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
        <PageToolbar />
        <Toaster />
        <div className="mb-4 px-4 md:px-0 pt-16 w-full max-w-[768px] transition-all self-center">
          {children}
        </div>
        {/* Vercel analytics */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
