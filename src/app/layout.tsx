// src/app/layout.tsx
// Root layout with Context Providers + SEO + Google Analytics + Vercel Analytics + Structured Data

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { SearchProvider } from "@/context/SearchContext";
import { Toaster } from "react-hot-toast";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Olditems - Buy & Sell Used Products in India | Marketplace",
  description:
    "Olditems is India's trusted marketplace to buy and sell used products. Post free ads for mobiles, furniture, electronics, vehicles, and more. Connect with genuine buyers and sellers near you.",
  metadataBase: new URL("https://www.olditems.in"),
  alternates: {
    canonical: "https://www.olditems.in",
  },
  openGraph: {
    title: "Olditems - India's Trusted Used Products Marketplace",
    description:
      "Buy and sell second-hand products easily on Olditems. Post free ads for mobiles, electronics, furniture, vehicles, and more. 100% genuine and verified listings.",
    url: "https://www.olditems.in",
    siteName: "Olditems.in",
    images: [
      {
        url: "https://www.olditems.in/logo.png",
        width: 1200,
        height: 630,
        alt: "Olditems.in - Buy & Sell Used Products",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Olditems - Buy & Sell Used Products Online",
    description:
      "India’s easiest way to buy and sell second-hand goods. Post your ad today for free!",
    images: ["https://www.olditems.in/logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // JSON-LD Structured Data
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Olditems.in",
    url: "https://www.olditems.in",
    logo: "https://www.olditems.in/logo.png",
    sameAs: [
      "https://www.facebook.com/olditemsin",
      "https://www.instagram.com/olditemsin",
      "https://www.linkedin.com/company/olditemsin",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91-9838824898",
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "olditems.in",
    url: "https://www.olditems.in",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.olditems.in/products?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SearchProvider>
            <Header />
            <main className="bg-gray-50">{children}</main>
            <Toaster position="top-right" />
            <Footer />
          </SearchProvider>
        </AuthProvider>

        {/* Structured Data for SEO */}
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([schemaData, websiteSchema]),
          }}
        />

        {/* Vercel Analytics */}
        <Analytics />

        {/* Google Analytics (GA4) */}
        <GoogleAnalytics gaId="G-5HE1YQDZN2" />
      </body>
    </html>
  );
}
