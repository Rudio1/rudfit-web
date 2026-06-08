import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:token([0-9a-f]{32})",
        destination: "/invite/:token",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
