import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

import { mainFont, monoFont } from "@/components/ui/providers/font-provider";
import { ThemeProvider } from "@/components/ui/providers/theme-provider";
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
      <body
        className={`${mainFont.variable} ${monoFont.variable} flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CursorBacklight />
          <PageHeader />
          <div className="w-full mt-16 pt-16 px-4 max-w-[700px] md:px-0 self-center transition-all">
            {children}
          </div>
        </ThemeProvider>
        {/* Vercel analytics */}
        <Analytics />
      </body>
    </html>
  );
}
