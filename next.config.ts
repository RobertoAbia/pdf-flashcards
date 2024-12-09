/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    
    // Configuración para PDF.js
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
      canvas: false
    };

    return config;
  },
  // Permitir la carga del worker de PDF.js
  experimental: {
    serverActions: true,
  }
};

export default nextConfig;
