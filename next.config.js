/** @type {import('next').NextConfig} */
const withPlugins = require('next-compose-plugins');
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  disable: process.env.NODE_ENV === 'development',
});
const removeImports = require('next-remove-imports')({});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    runtime: 'experimental-edge',
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
};

module.exports = withPlugins([[withPWA], [removeImports]], nextConfig);
