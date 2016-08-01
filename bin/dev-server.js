#!/usr/bin/env node

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const env = String(process.env.RAILS_ENV || process.env.NODE_ENV);
const railsRoot = process.argv[2];

const Hauler = require('hauler');
const devServerConfig = Hauler.getDevServerConfig(env, railsRoot);
const compilerConfig = Hauler.getCompilerConfig(env, railsRoot);

// console.log(devServerConfig);
// console.log(compilerConfig);

const compiler = webpack(compilerConfig);
const devServer = new WebpackDevServer(compiler, devServerConfig);
devServer.listen(devServerConfig.port, devServerConfig.host, (err) => {
  if (err) {
    throw err;
  }
});
