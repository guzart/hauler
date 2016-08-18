// @flow

export default function defaultConfigFactory(env: string): WebpackConfig {
  const config = {
    output: {
      filename: '[name].[chunkhash].js',
      path: '~public/assets',
      chunkFilename: '[name].[chunkhash].chunk.js',
    },
    resolve: {
      modules: [
        'node_modules',
        '~app/assets',
        '~lib/assets',
      ],
      extensions: ['.js', '.json', '.jsx']
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
