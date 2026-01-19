import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api-ekaplus.ekatunggal.com",
        // port: "8000",
        pathname: "/files/**",
      },
    ],
    // remotePatterns: [
    //   {
    //     protocol: "http",
    //     hostname: "192.168.101.214",
    //     port: "8000",
    //     pathname: "/files/**",
    //   },
    // ],
  },
};

export default nextConfig;