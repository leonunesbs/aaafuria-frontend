/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa');
const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    runtime: 'experimental-edge',
  },
  pwa: {
    dest: 'public',
    register: true,
    disable: process.env.NODE_ENV === 'development',
  },
  images: {
    domains: [
      'aaafuria-reborn.s3.amazonaws.com',
      'aaafuria-reborn.s3.sa-east-1.amazonaws.com',
    ],
  },
  env: {
    BACKEND_DOMAIN: 'https://backend.aaafuria.site',
    DIRETORIA_DOMAIN: 'https://diretoria.aaafuria.site',
    NEXT_PUBLIC_GA_ID: 'G-K5LPGWWJL1',
    PUBLIC_AWS_URI: 'https://aaafuria-reborn.s3.sa-east-1.amazonaws.com/public',
  },
});

module.exports = nextConfig;
