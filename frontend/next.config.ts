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
  allowedDevOrigins: ['localhost:8000', 'localhost:8001', '*.trycloudflare.com', '127.0.0.1:8000', '127.0.0.1:8001', '0.0.0.0:8000', '0.0.0.0:8001'],
};

export default nextConfig;
