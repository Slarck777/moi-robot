import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [390, 640, 750, 828, 1080],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
  },
  async headers() {
    return [
      {
        source: "/:path*.(webp|png|jpg|svg|ico|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
