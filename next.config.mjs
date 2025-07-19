import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

 // Reference to your i18n setup

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cdn.usegalileo.ai'],  // Allowing images from specific domains
  },
};

export default withNextIntl(nextConfig);
