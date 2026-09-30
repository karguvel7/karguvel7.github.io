import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AmbientBackdrop } from "@/components/ambient-backdrop";
import { experience, site } from "@/lib/content";
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

export const viewport: Viewport = {
  themeColor: "#0b0c0e",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Karguvel K · AI Engineer",
    template: "%s · Karguvel K",
  },
  description: site.description,
  applicationName: "Karguvel K",
  authors: [{ name: site.name, url: site.github }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Karguvel K · AI Engineer",
    description: site.summary,
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: site.profileImage,
        width: 484,
        height: 630,
        alt: site.profileImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Karguvel K · AI Engineer",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full">
        <AmbientBackdrop />
        <div className="grid-fade" aria-hidden="true" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
