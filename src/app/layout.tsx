import type { Metadata } from "next";

import { mainFont, monoFont } from "@/components/ui/providers/font-provider";
import { ThemeProvider } from "@/components/ui/providers/theme-provider";
import PageHeader from "@/components/common/PageHeader";

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
          <PageHeader />
          <div className="w-full mt-16 pt-16 px-4 lg:px-16 xl:w-[1000px] xl:px-0 self-center transition-all">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
