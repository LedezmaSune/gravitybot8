import path from 'path';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Permitir tráfico de desarrollo local y túneles
  allowedDevOrigins: ['localhost:8000', 'localhost:8001', '*.trycloudflare.com', '192.168.56.1'],
};

export default nextConfig;
