import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // HSTS from the app so it ships with the build — the same reasoning as the
  // casino sites (see sites/site-template/next.config.ts).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }],
      },
    ];
  },

  images: {
    // Product images are served by the Laravel storage backend; locally that
    // is http://localhost:8000, a private address Next 16 refuses by default.
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
