import type { Metadata } from "next";
import "./globals.css";
import { interTight, instrumentSerif, jetbrainsMono } from "./fonts";
import { SmoothScroll } from "@/components/smooth-scroll";
import { RevealProvider } from "@/components/reveal-provider";
import { SiteNav } from "@/components/site-nav";
import { PROFILE } from "@/lib/data";

export const metadata: Metadata = {
  metadataBase: new URL(PROFILE.siteUrl),
  title: `${PROFILE.name} — ${PROFILE.role}`,
  description: PROFILE.summary,
  openGraph: {
    title: `${PROFILE.name} — ${PROFILE.role}`,
    description: PROFILE.summary,
    url: PROFILE.siteUrl,
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        <SmoothScroll />
        <RevealProvider />
        <SiteNav />
        <main>{children}</main>
      </body>
    </html>
  );
}
