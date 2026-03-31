import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Enable output tracing for monorepo builds (Vercel)
  outputFileTracingRoot: "../",
  
  // Transpile workspace packages if needed
  transpilePackages: ["@response-advantage/geometric-core"],
  
  // Experimental features for Next.js 16
  experimental: {
    // Turbopack configuration for monorepo
    turbo: {
      // Explicitly set root to the monorepo root so Turbopack can resolve packages
      root: path.resolve(__dirname, ".."),
    },
  },
};

export default nextConfig;
