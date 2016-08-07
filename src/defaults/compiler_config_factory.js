// @flow

export default function defaultConfigFactory(env: string): WebpackConfig {
  const config = {
    output: {
      filename: '[name].[chunkhash].js',
      path: '~public/assets',
      chunkFilename: '[name].[chunkhash].chunk.js',
    },
    resolve: {
      root: [
        '~app/assets',
        '~lib/assets',
      ],
    },
    devtool: '',
    target: 'web',
  };

  if (env === 'development') {
    config.output.filename = '[name].js';
    config.output.chunkFilename = '[name].chunk.js';
  }

  return config;
}
