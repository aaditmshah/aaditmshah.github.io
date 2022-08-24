// @ts-check
// eslint-disable-next-line unicorn/prefer-module, import/no-unused-modules -- This is a config file.
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

// eslint-disable-next-line unicorn/prefer-module, import/no-commonjs -- This is a config file.
module.exports = nextConfig;
