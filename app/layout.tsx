import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { resume } from "@/data/resume";
import { getAvailableSocialLinks } from "@/lib/resume-utils";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const availableSocialLinks = getAvailableSocialLinks(resume.links).map((link) => link.url);

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: `${resume.name} — ${resume.headline}`,
    template: `%s — ${resume.name}`,
  },
  description: resume.profile,
  keywords: [resume.headline, ...resume.skills.flatMap((group) => group.items)],
  authors: [{ name: resume.name }],
  creator: resume.name,
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    title: `${resume.name} — ${resume.headline}`,
    description: resume.profile,
    siteName: resume.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${resume.name} — ${resume.headline}`,
    description: resume.profile,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#090a0f",
  colorScheme: "dark",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: resume.name,
  jobTitle: resume.headline,
  description: resume.profile,
  email: `mailto:${resume.email}`,
  telephone: resume.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: resume.location,
  },
  ...(availableSocialLinks.length > 0 ? { sameAs: availableSocialLinks } : {}),
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {/* JSON-LD is serialized from the local resume data for crawlers. */}
        {/* eslint-disable-next-line react/no-danger */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        {children}
      </body>
    </html>
  );
}
