/** @type {import('next').NextConfig} */

const path = require('path');
const webpack = require('webpack');

module.exports = {
  images: {
    domains: ['s.gravatar.com'],
    loader: 'custom',
  },
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  swcMinify: true,
  webpack: (config, _) => {
    config.experiments = {
      layers: true,
      topLevelAwait: true,
    };

    config.plugins.push(
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
      })
    );

    config.resolve.alias = {
      ...config.resolve.alias,
      lib: path.resolve(__dirname, 'lib'),
      pages: path.resolve(__dirname, 'src/pages'),
    };

    return config;
  },
};
