import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Emit a self-contained server at .next/standalone (minimal server.js + only
  // the traced node_modules) so the Docker runner image stays small and needs
  // neither `next start` nor a full install. The casino sites all do this; the
  // production Dockerfile copies that folder and runs `node server.js`.
  output: "standalone",
  // Pin file tracing to THIS folder. Otherwise the parent monorepo lockfile
  // makes Next infer casino-platform/ as the root and nest the output at
  // .next/standalone/sites/bigglowday/server.js, breaking the Docker CMD.
  outputFileTracingRoot: projectRoot,
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
