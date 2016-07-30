#!/usr/bin/env node --use_strict

// const webpack = require('webpack');
// const WebpackDevServer = require('webpack-dev-server');

const env = process.env.RAILS_ENV || process.env.NODE_ENV;
const devServerConfig = require('spiral-rails/src/config/webpack_dev_server')(env);
const compilerConfig = require('spiral-rails/src/config/webpack_compiler')(env);

console.log(devServerConfig);
console.log(compilerConfig);

// const compiler = webpack(webpackConfig);
// const devServer = new WebpackDevServer(compiler, devServerConfig);
// devServer.listen(devServerConfig.port, devServerConfig.host, (err) => {
//   if (err) {
//     throw err;
//   }
// });
