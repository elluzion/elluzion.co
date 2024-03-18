import localFont from "next/font/local";

/**
 * Storing the main fonts of the webpage.
 * main sans: Geist (Vercel)
 * mono font: JetBrains Mono (JetBrains)
 *
 * Both fonts are variable font faces, as they simplify the usage of custom fonts massively and are widely adapted
 * ^ https://caniuse.com/variable-fonts
 */

const geistFont = localFont({
  src: "GeistVariable.ttf",
  display: "swap",
  variable: "--font-geist",
});

const JBMonoFont = localFont({
  src: "JetBrainsMonoVariable.ttf",
  display: "swap",
  variable: "--font-jbmono",
});

export { geistFont as mainFont, JBMonoFont as monoFont };
