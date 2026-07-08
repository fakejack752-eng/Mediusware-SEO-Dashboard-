import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Do NOT use "standalone" output for Vercel deployment
  // Vercel handles its own build output format
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Required for cross-origin preview
  allowedDevOrigins: [
    "https://*.space-z.ai",
  ],
};

export default nextConfig;