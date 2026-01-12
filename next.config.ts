import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["lucide-react"],
  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: ["https://*.replit.dev"],
};

export default nextConfig;
