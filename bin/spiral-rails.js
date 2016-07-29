#!/usr/bin/env node
'use strict';

// https://github.com/webpack/webpack-dev-server/blob/v2.1.0-beta.0/bin/webpack-dev-server.js

const merge = require('ramda/src/merge');
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const railsRoot = process.cwd();
const railsPath = (...args) => path.join(railsRoot, ...args);
const spiralConfig = require(railsPath('config/spiral.js'));

const fs = require('fs');
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
  context: railsPath('app/assets'),
  entry: getEntriesAt(railsPath('app/assets')),
  output: {
    filename: '[name].[chunkhash].js',
    path: railsPath('public/assets'),
    publicPath: '/',
    chunkFilename: '[name].[chunkhash].chunk.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: 'style!css!sass',
      },
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
  plugins: [

  ],
  devtool: '',
  target: 'web',
  // stats: false,
  progress: true,
}, spiralConfig.webpack);

console.log(webpackConfig);

// const compiler = webpack(webpackConfig);
// const devServer = new WebpackDevServer(compiler, devServerConfig);
// devServer.listen(devServerConfig.port, devServerConfig.host, (err) => {
//   if (err) {
//     throw err;
//   }
// });
