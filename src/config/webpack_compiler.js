const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OfflinePlugin = require('offline-plugin');
const webpack = require('webpack');

const spiralRails = require('../../index');

function getPlugins(env) {
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
      new OfflinePlugin({
        relativePaths: false,
        publicPath: '/',
        excludes: ['.htaccess'],
        caches: {
          main: [':rest:'],
          additional: ['*.chunk.js'],
        },
        safeToUseOptionalCaches: true,
        AppCache: false,
      }),
    ]);
  }

  return plugins;
}

function configFactory(env) {
  const loaders = {
    // individual loaders so that they can be replaced separately
    javascriptLoader: {
      test: /\.jsx?$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        presets: ['es2015-webpack', 'react', 'stage-2'],
        plugins: ['transform-class-properties'],
      },
    },
    sassLoader: {
      test: /\.scss$/,
      loader: 'style!css!sass',
    },
    fontLoader: {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      loader: 'file',
    },
    imageLoader: {
      test: /\.(jpg|png|gif)$/,
      loaders: [
        'file',
        'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}',
      ],
    },
  };

  if (env === 'production') {
    loaders.javascriptLoader.query.plugins = loaders.javascriptLoader.query.plugins.concat([
      'transform-react-remove-prop-types',
      'transform-react-constant-elements',
      'transform-react-inline-elements',
    ]);

    loaders.sassLoader.loader = ExtractTextPlugin.extract(
      'style',
      loaders.sassLoader.loader.replace('style!', '')
    );
  }

  const plugins = {
    appendPlugins: [],
    plugins: getPlugins(env),
    prependPlugins: [],
  };


  // straight webpack configuration
  const compiler = {
    output: {
      filename: '[name].[chunkhash].js',
      path: 'public/assets',
      publicPath: '/assets/',
      chunkFilename: '[name].[chunkhash].chunk.js',
    },
    resolve: {
      root: [
        'app/assets',
        'lib/assets',
      ],
    },
    devtool: '',
    target: 'web',
    progress: true,
  };

  if (env === 'development') {
    compiler.output.filename = '[name].js';
    compiler.output.chunkFilename = '[name].chunk.js';
  }

  return {
    compiler,
    loaders,
    plugins,
  };
}

module.exports = spiralRails.webpackCompilerConfigFactory(configFactory);
