import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable output tracing for monorepo builds (Vercel)
  outputFileTracingRoot: "../",
  
  // Transpile workspace packages if needed
  transpilePackages: ["@response-advantage/geometric-core"],
  
  // Experimental features for Next.js 16
  experimental: {
    // Enable Turbopack (stable in Next.js 16)
    turbo: {},
  },
};

export default nextConfig;
