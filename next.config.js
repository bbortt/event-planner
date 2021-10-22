const webpack = require('webpack');

module.exports = {
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

    return config;
  },
};
