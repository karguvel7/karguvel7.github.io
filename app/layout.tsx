import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { AmbientBackdrop } from "@/components/ambient-backdrop";
import { MotionShell } from "@/components/motion-shell";
import { ThemeBootstrap } from "@/components/theme-bootstrap";
import { experience, site } from "@/lib/content";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef1f6" },
    { media: "(prefers-color-scheme: dark)", color: "#080B12" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Karguvel K · AI Architect · AI Systems",
    template: "%s · Karguvel K",
  },
  description: site.description,
  applicationName: "Karguvel K",
  authors: [{ name: site.name, url: site.github }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Karguvel K · AI Architect · AI Systems",
    description: site.summary,
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: site.profileImage,
        width: 968,
        height: 1162,
        alt: site.profileImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Karguvel K · AI Architect · AI Systems",
    description: site.summary,
    images: [site.profileImage],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: site.url,
  mainEntity: {
    "@type": "Person",
    name: site.fullName,
    alternateName: [site.name, site.handle],
    url: site.url,
    email: site.email,
    jobTitle: site.jobTitle,
    description: site.description,
    worksFor: {
      "@type": "Organization",
      name: site.employer,
    },
    alumniOf: experience.education.map((item) => ({
      "@type": "CollegeOrUniversity",
      name: item.school,
    })),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chennai",
      addressCountry: "IN",
    },
    image: `${site.url}${site.profileImage}`,
    sameAs: [site.github, site.linkedin],
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
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="preconnect" href="https://api.open-meteo.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.github.com" crossOrigin="anonymous" />
      </head>
      <body className="relative min-h-full min-w-0 overflow-x-clip theme-craft-v2">
        <ThemeBootstrap />
        <MotionShell>
          <AmbientBackdrop />
          <div className="grid-fade" aria-hidden="true" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          {children}
        </MotionShell>
      </body>
    </html>
  );
}
