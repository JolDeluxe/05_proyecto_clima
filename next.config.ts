import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: ({ url }: { url: URL }) => url.pathname.startsWith("/api/"),
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "api-clima",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 3600,
        },
      },
    },
  ],
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true,
      },
    ];
  },
};

export default withPWA(nextConfig);