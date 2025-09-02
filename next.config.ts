import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.1.65"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kdrwquzkzapgdjxbkfwc.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
