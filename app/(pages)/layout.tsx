import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import type { Metadata } from "next";
import "../globals.css";
import { Toaster } from "sonner";
import { ConvexClientProvider } from "../components/providers/convex-client-provider";
import { AuthRedirectHandler } from "../components/auth/auth-redirect-handler";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Free Professional Websites for Local Businesses",
    template: "%s | Locosite",
  },
  description:
    "We build professional websites for local businesses. Done for you, free to publish. No DIY, no hassle. Upgrade from $9/month for editing and custom domains.",
  keywords: [
    "local business website",
    "website for attorneys",
    "professional website service",
    "done for you website",
    "small business website",
    "affordable website",
  ],
  authors: [{ name: "Locosite Team" }],
  creator: "Locosite",
  publisher: "Locosite",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Locosite",
    title: "Locosite - Professional Business Websites",
    description:
      "Create professional websites for your business in minutes. Import from Google Maps, customize with AI, and get online instantly.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Locosite - Professional Business Websites",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Locosite - Professional Business Websites",
    description:
      "Create professional websites for your business in minutes. Import from Google Maps, customize with AI, and get online instantly.",
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
    google: process.env.GOOGLE_SITE_VERIFICATION,
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
        className={`${display.variable} ${body.variable} antialiased font-body`}
      >
        <ConvexAuthNextjsServerProvider>
          <ConvexClientProvider>
            <AuthRedirectHandler />
            {children}
          </ConvexClientProvider>
        </ConvexAuthNextjsServerProvider>
        <Toaster />
      </body>
    </html>
  );
}
