import path from 'path';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/api/:path*",
      },
      {
        source: "/socket.io/:path*",
        destination: "http://localhost:3001/socket.io/:path*",
      },
    ];
  },
  // Permitir tráfico de desarrollo local y túneles
  allowedDevOrigins: ['localhost:3000', 'localhost:3001', '*.trycloudflare.com', '192.168.56.1'],
};

export default nextConfig;
