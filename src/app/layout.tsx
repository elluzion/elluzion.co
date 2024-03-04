import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistFont = localFont({
  src: "../../public/fonts/GeistVariable.ttf",
  display: "swap",
  variable: "--font-geist",
});

const JBMonoFont = localFont({
  src: "../../public/fonts/JetBrainsMonoVariable.ttf",
  display: "swap",
  variable: "--font-jbmono",
});

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
      <body className={`${geistFont.variable} ${JBMonoFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
