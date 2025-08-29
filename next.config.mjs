/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Desabilitar SSG para resolver problemas com useContext
  experimental: {
    // Desabilitar geração estática automática
    isrMemoryCacheSize: 0,
  },
  
  // Configurações de ambiente
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'SPAC',
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  },
  
  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  
  // Configurações de imagem
  images: {
    domains: ['localhost', 'zibuyabpsvgulvigvdtb.supabase.co'],
  },
  
  // Configurações de build
  typescript: {
    // Ignorar erros de TypeScript durante o build
    ignoreBuildErrors: false,
  },
  
  eslint: {
    // Ignorar erros de ESLint durante o build
    ignoreDuringBuilds: false,
  },
  
  // Configurações de output
  output: 'standalone',
  
  // Configurações de webpack
  webpack: (config, { isServer }) => {
    // Resolver problemas com módulos do Supabase
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
};

export default nextConfig;
