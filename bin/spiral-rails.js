#!/usr/bin/env node --use_strict
// @flow

// const webpack = require('webpack');
// const WebpackDevServer = require('webpack-dev-server');

const env = String(process.env.RAILS_ENV || process.env.NODE_ENV);
const spiralRails = require('spiral-rails');
const devServerConfig = spiralRails.getDevServerConfig(env);
const compilerConfig = spiralRails.getCompilerConfig(env);

console.log(devServerConfig);
console.log(compilerConfig);

// const compiler = webpack(webpackConfig);
// const devServer = new WebpackDevServer(compiler, devServerConfig);
// devServer.listen(devServerConfig.port, devServerConfig.host, (err) => {
//   if (err) {
//     throw err;
//   }
// });
