import path from 'path';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/socket.io/:path*",
        destination: `${backendUrl}/socket.io/:path*`,
      },
    ];
  },
  // Permitir tráfico de desarrollo local y túneles
  allowedDevOrigins: ['localhost:3000', 'localhost:3001', '*.trycloudflare.com', '192.168.56.1'],
};

export default nextConfig;
