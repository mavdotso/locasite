import type { NextConfig } from "next";
import "./env";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "careful-emu-235.convex.cloud",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "lh4.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "lh5.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "lh6.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "streetviewpixels-pa.googleapis.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  webpack: (config) => {
    config.cache = {
      ...config.cache,
      compression: 'gzip',
      maxMemoryGenerations: 1,
    };
    return config;
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              icon: true,
              typescript: true,
            },
          },
        ],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
