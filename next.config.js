const path = require('path');
const webpack = require('webpack');

module.exports = {
  basePath: '',
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
      // TODO: Track https://github.com/react-dnd/react-dnd/issues/3401
      'react/jsx-dev-runtime.js': 'react/jsx-dev-runtime',
      'react/jsx-runtime.js': 'react/jsx-runtime',
    };

    return config;
  },
  async rewrites() {
    return [
      {
        source: '/:any*',
        destination: '/',
      },
    ];
  },
};
