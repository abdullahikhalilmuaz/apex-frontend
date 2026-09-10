import type { Metadata } from "next";
import "@/styles/global.css";

export const metadata: Metadata = {
  title: {
    default: "Apex Global Academy | Best Primary School in Katsina, Nigeria",
    template: "%s | Apex Global Academy",
  },
  description:
    "Apex Global Academy is a leading primary school in Katsina, Nigeria. Quality education, smart learning, and a nurturing environment. Apply now!",
  keywords: [
    "Apex Global Academy",
    "Apex Global Academy Katsina",
    "Apex Global Academy KTN",
    "Apex Global Academy Nigeria",
    "best primary school in Katsina",
    "primary school Katsina",
    "private school Katsina",
    "Apex primary school",
    "Apex Global Academy admissions",
    "Apex Global Academy portal",
    "Nigerian primary school",
    "Katsina school",
  ],
  authors: [{ name: "Apex Global Academy" }],
  creator: "Apex Global Academy",
  publisher: "Apex Global Academy",
  metadataBase: new URL("https://apex-global-academy.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://apex-global-academy.vercel.app",
    siteName: "Apex Global Academy",
    title: "Apex Global Academy | Best Primary School in Katsina, Nigeria",
    description:
      "Nurturing bright minds for a brighter future. Quality primary education in Katsina, Nigeria.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Apex Global Academy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apex Global Academy | Best Primary School in Katsina",
    description:
      "Nurturing bright minds for a brighter future. Quality primary education in Katsina, Nigeria.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://apex-global-academy.vercel.app",
  },
  verification: {
    google: "googleaf9947d6b497a90e",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "School",
    name: "Apex Global Academy",
    description:
      "A leading primary school in Katsina, Nigeria, committed to quality education.",
    url: "https://apex-global-academy.vercel.app",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Katsina",
      addressRegion: "Katsina State",
      addressCountry: "NG",
    },
    telephone: "+234-800-000-0000",
    email: "info@apexglobalacademy.com",
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
