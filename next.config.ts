// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "api-ekaplus.ekatunggal.com",
//         // port: "8000",
//         pathname: "/files/**",
//       },
//     ],
//     // remotePatterns: [
//     //   {
//     //     protocol: "http",
//     //     hostname: "192.168.101.214",
//     //     port: "8000",
//     //     pathname: "/files/**",
//     //   },
//     // ],
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
