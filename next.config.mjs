/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Desabilitar SSG para resolver problemas com useContext
  experimental: {
    // Desabilitar geração estática automática
    isrMemoryCacheSize: 0,
    // Desabilitar otimizações estáticas
    staticPageGenerationTimeout: 0,
    // Forçar renderização dinâmica
    dynamicParams: true,
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
    unoptimized: true,
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
    
    // Desabilitar otimizações que causam problemas
    config.optimization = {
      ...config.optimization,
      splitChunks: false,
      minimize: false,
    };
    
    return config;
  },
  
  // Desabilitar geração estática para todas as páginas
  trailingSlash: false,
  
  // Configurações de build estático
  staticPageGenerationTimeout: 0,
  
  // Forçar renderização dinâmica
  generateStaticParams: async () => {
    return [];
  },
  
  // Desabilitar SSG completamente
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  
  // Configurações de build
  distDir: '.next',
  
  // Desabilitar otimizações que causam problemas
  swcMinify: false,
  
  // Configurações de compressão
  compress: false,
  
  // Configurações de cache
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // Configurações de build estático
  async rewrites() {
    return [];
  },
  
  // Configurações de redirecionamento
  async redirects() {
    return [];
  },
  
  // Configurações de build
  poweredByHeader: false,
  
  // Configurações de compressão
  compress: false,
  
  // Configurações de otimização
  optimizeFonts: false,
  
  // Configurações de build
  generateEtags: false,
};

export default nextConfig;
