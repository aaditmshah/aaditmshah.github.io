// @ts-check
"use strict";

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/u,
      use: ["@svgr/webpack"]
    });
    return config;
  },
  experimental: {
    images: {
      unoptimized: true
    }
  }
};

module.exports = nextConfig;
