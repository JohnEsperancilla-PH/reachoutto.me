import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200","300","400","500","600","700","800"],
});

export const metadata: Metadata = {
  title: "reachoutto.me - Your Digital Identity in One Link",
  description: "Create a beautiful, customizable landing page that showcases all your important links. Perfect for social media bios, business cards, and everywhere you need to share multiple links.",
  keywords: ["linktree", "link in bio", "social media", "profile", "links", "bio link", "digital identity"],
  authors: [{ name: "reachoutto.me" }],
  creator: "reachoutto.me",
  publisher: "reachoutto.me",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://reachoutto.me'),
  openGraph: {
    title: "reachoutto.me - Your Digital Identity in One Link",
    description: "Create a beautiful, customizable landing page that showcases all your important links. Perfect for social media bios, business cards, and everywhere you need to share multiple links.",
    url: "/",
    siteName: "reachoutto.me",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "reachoutto.me - Your Digital Identity in One Link",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "reachoutto.me - Your Digital Identity in One Link",
    description: "Create a beautiful, customizable landing page that showcases all your important links. Perfect for social media bios, business cards, and everywhere you need to share multiple links.",
    creator: "@reachoutto",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bricolage.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
