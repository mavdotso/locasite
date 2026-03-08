import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { ConvexClientProvider } from "./components/providers/convex-client-provider";
import { env } from "@/env";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Free Website for Your Local Business, Done for You | Locosite",
    template: "%s | Locosite",
  },
  description:
    "Locosite builds your business website from your Google Maps listing \u2014 no tech skills, no agency fees. Publish free, upgrade from $9/mo. Restaurants, plumbers, HVAC, landscapers.",
  keywords: [
    "website for local business",
    "done for you website small business",
    "AI website builder for local business",
    "cheap website for small business",
    "done for you restaurant website",
  ],
  authors: [{ name: "Locosite Team" }],
  creator: "Locosite",
  publisher: "Locosite",
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Locosite",
    title: "Free Website for Your Local Business, Done for You | Locosite",
    description:
      "Locosite builds your business website from your Google Maps listing \u2014 no tech skills, no agency fees. Publish free, upgrade from $9/mo.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Free Website for Your Local Business, Done for You | Locosite",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Website for Your Local Business, Done for You | Locosite",
    description:
      "Locosite builds your business website from your Google Maps listing \u2014 no tech skills, no agency fees. Publish free, upgrade from $9/mo.",
    images: ["/og-image.png"],
    creator: "@locosite",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: env.GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexAuthNextjsServerProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ConvexAuthNextjsServerProvider>
        <Toaster />
      </body>
    </html>
  );
}
