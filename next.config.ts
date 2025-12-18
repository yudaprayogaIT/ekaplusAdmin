import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.100.203",
        port: "8000",
        pathname: "/files/**",
      },
    ],
  },
};

export default nextConfig;