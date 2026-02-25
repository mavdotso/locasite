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
    default: "Locasite - Professional Business Websites",
    template: "%s | Locasite",
  },
  description:
    "Create professional websites for your business in minutes. Import from Google Maps, customize with AI, and get online instantly. Perfect for local businesses.",
  keywords: [
    "business website",
    "local business",
    "website builder",
    "Google Maps",
    "AI website",
    "professional websites",
  ],
  authors: [{ name: "Locasite Team" }],
  creator: "Locasite",
  publisher: "Locasite",
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Locasite",
    title: "Locasite - Professional Business Websites",
    description:
      "Create professional websites for your business in minutes. Import from Google Maps, customize with AI, and get online instantly.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Locasite - Professional Business Websites",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Locasite - Professional Business Websites",
    description:
      "Create professional websites for your business in minutes. Import from Google Maps, customize with AI, and get online instantly.",
    images: ["/og-image.png"],
    creator: "@locasite",
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
