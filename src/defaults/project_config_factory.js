// @flow

import ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as webpack from 'webpack';

import devServerConfigFactory from './dev_server_config_factory';
import compilerConfigFactory from './compiler_config_factory';

function getPlugins(env: string) {
  let plugins = [
    new webpack.ProvidePlugin({ fetch: 'exports?self.fetch!whatwg-fetch' }),
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify(env) } }),
    new webpack.optimize.CommonsChunkPlugin({
      children: true,
      minChunks: 2,
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
  const entries = {};

  // individual loaders so that they can be replaced separately
  const javascriptLoader = {
    test: /\.jsx?$/,
    loader: 'babel',
    exclude: /node_modules/,
    query: {
      presets: ['es2015', 'react', 'stage-2'],
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

  const publicPath = '/assets';

  const devServer = devServerConfigFactory(env);

  const compiler = compilerConfigFactory(env);

  return {
    entries,
    javascriptLoader,
    sassLoader,
    fontLoader,
    imageLoader,
    prependPlugins,
    plugins,
    appendPlugins,
    publicPath,
    devServer,
    compiler,
  };
}

export default configFactory;
