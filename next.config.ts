import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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