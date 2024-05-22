import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";

import CursorBacklight from "@/app/_components/cursor-backlight";
import PageToolbar from "@/app/_components/page-toolbar";
import { Toaster } from "@/components/toaster";
import { mainFont, monoFont } from "@/lib/fonts/font-provider";

import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mainFont.variable} ${monoFont.variable} font-sans overflow-x-hidden`}>
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

/**
 * The metadata tags of the page for SEO
 */
export const metadata: Metadata = {
  title: {
    default: "Elluzion",
    template: "%s | Elluzion",
  },
  description: "All releases of mine are stored here.",
};
