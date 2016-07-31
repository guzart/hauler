// @flow

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

function getPlugins(env: string) {
  let plugins = [
    new webpack.ProvidePlugin({ fetch: 'exports?self.fetch!whatwg-fetch' }),
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify(env) } }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      children: true,
      minChunks: 2,
      async: true,
    }),
  ];

  if (env === 'development') {
    plugins = plugins.concat([
      new webpack.NoErrorsPlugin(),
    ]);
  }

  if (env === 'production') {
    plugins = plugins.concat([
      new webpack.optimize.OccurrenceOrderPlugin(true),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
      new ExtractTextPlugin('[name].[contenthash].css'),
    ]);
  }

  return plugins;
}

function configFactory(env: string) {
  // individual loaders so that they can be replaced separately
  const javascriptLoader = {
    test: /\.jsx?$/,
    loader: 'babel',
    exclude: /node_modules/,
    query: {
      presets: ['es2015-webpack', 'react', 'stage-2'],
      plugins: ['transform-class-properties'],
    },
  };

  const sassLoader = {
    test: /\.scss$/,
    loader: 'style!css!sass',
  };

  const fontLoader = {
    test: /\.(eot|svg|ttf|woff|woff2)$/,
    loader: 'file',
  };

  const imageLoader = {
    test: /\.(jpg|png|gif)$/,
    loaders: [
      'file',
      'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}',
    ],
  };

  if (env === 'production') {
    javascriptLoader.query.plugins = javascriptLoader.query.plugins.concat([
      'transform-react-remove-prop-types',
      'transform-react-constant-elements',
      'transform-react-inline-elements',
    ]);

    sassLoader.loader = ExtractTextPlugin.extract(
      'style',
      sassLoader.loader.replace('style!', '')
    );
  }

  const appendPlugins = [];
  const plugins = getPlugins(env);
  const prependPlugins = [];

  // straight webpack configuration
  const compiler = {
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
    compiler.output.filename = '[name].js';
    compiler.output.chunkFilename = '[name].chunk.js';
  }

  return {
    javascriptLoader,
    sassLoader,
    fontLoader,
    imageLoader,
    prependPlugins,
    plugins,
    appendPlugins,
    compiler,
  };
}

module.exports = configFactory;
