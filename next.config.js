const path = require('path');
const webpack = require('webpack');

module.exports = {
  distDir: 'build/next',
  images: {
    domains: ['s.gravatar.com'],
    loader: 'custom',
  },
  webpack: (config, _) => {
    config.experiments = {
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
      lib: path.resolve(__dirname, 'src/main/webapp/lib'),
      pages: path.resolve(__dirname, 'src/pages'),
    };

    return config;
  },
};
