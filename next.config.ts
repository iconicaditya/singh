import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["lucide-react"],
  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: ["*.replit.dev", "*.repl.co"],
};

export default nextConfig;
