#!/usr/bin/env node
'use strict';

// https://github.com/webpack/webpack-dev-server/blob/v2.1.0-beta.0/bin/webpack-dev-server.js

const fs = require('fs');
const merge = require('ramda/src/merge');
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const isDev = process.env.NODE_ENV !== 'production' && process.env.RAILS_ENV !== 'production';
const railsRoot = process.cwd();
const railsPath = (...args) => path.join(railsRoot, ...args);
const spiralConfig = require(railsPath('config/spiral.js'));

function getEntriesAt(targetPath) {
  const filePaths = fs.readdirSync(targetPath).map(fn => path.join(targetPath, fn));
  const dirs = filePaths.filter(fp => fs.statSync(fp).isDirectory());
  return dirs.reduce(
    (memo, dirPath) => {
      const entryName = path.basename(dirPath);
      const entryFile = path.join(dirPath, 'index.js');
      memo[entryName] = entryFile;
      return memo;
    },
    {}
  );
}

function resolveEntries(entries) {
  if (!entries) {
    return null;
  }

  if (typeof entries === 'string') {
    return railsPath(entries);
  }

  if (Array.isArray(entries)) {
    return entries.map(entry => resolveEntries(entry));
  }

  return Object.keys(entries).reduce(
    (memo, key) => {
      memo[key] = resolveEntries(entries[key]);
      return memo;
    },
    {}
  );
}

function getAppWebpackConfig(config) {
  if (!config) {
    return {};
  }

  return Object.assign(config, {
    entry: resolveEntries(config.entry),
  });
}

const devServerConfig = merge({
  headers: { 'AccessControl-Allow-Origin': '*' },
  host: 'localhost',
  hot: true,
  inline: true,
  // outputPath: '/',
  port: 8080,
  publicPath: '/assets/',
  quiet: false,
  noInfo: false,
  stats: {
    // chunks: true,
    // chunkModules: true,
    colors: true,
    // timings: true,
  },
}, spiralConfig.devServer || {});

const webpackConfig = merge({
  context: railsRoot,
  entry: getEntriesAt(railsPath('app/assets')),
  output: (function getOutput() {
    if (isDev) {
      return {
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
      };
    }

    return {
      filename: '[name].[chunkhash].js',
      path: railsPath('public/assets'),
      publicPath: '/',
      chunkFilename: '[name].[chunkhash].chunk.js',
    };
  }()),
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        // query: {
        //   presets: ['es2015-webpack', 'react', 'stage-2'],
        //   plugins: [],
        // },
      },
      (function getCssLoader() {
        const spec = { test: /\.scss$/, exclude: /node_modules/, loader: 'style!css!sass' };
        if (isDev) {
          const cssQuery = 'localIdentName=[local]__[path][name]__[hash:base64:5]&modules&importLoaders=1&sourceMap';
          spec.loader = `style!css?${cssQuery}!sass?sourceMap`;
        }

        return spec;
      }()),
      {
        test: /\.css$/,
        include: /node_modules/,
        loader: 'style!css',
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader',
      },
      {
        test: /\.(jpg|png|gif)$/,
        loaders: [
          'file-loader',
          'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}',
        ],
      },
    ],
  },
  resolve: {
    root: [
      railsPath('app/assets'),
      railsPath('lib/assets'),
    ],
  },
  plugins: (function getPlugins() {
    const plugins = [];
    plugins.push(new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      children: true,
      minChunks: 2,
      async: true,
    }));
    plugins.push(new webpack.NoErrorsPlugin());
    return plugins;
  }()),
  devtool: isDev ? 'cheap-module-eval-source-map' : undefined,
  target: 'web',
  // stats: false,
  progress: true,
}, getAppWebpackConfig(spiralConfig.webpack));

console.log(webpackConfig);

const compiler = webpack(webpackConfig);
const devServer = new WebpackDevServer(compiler, devServerConfig);
devServer.listen(devServerConfig.port, devServerConfig.host, (err) => {
  if (err) {
    throw err;
  }
});
