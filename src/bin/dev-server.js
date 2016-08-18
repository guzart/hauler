#!/usr/bin/env node

const hauler = require('../index');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const env = hauler.getEnvName();
const railsRoot = process.argv[2];

const devServerConfig = hauler.getDevServerConfig(env, railsRoot);
const compilerConfig = hauler.getCompilerConfig(env, railsRoot);

// console.log(devServerConfig);
// console.log(compilerConfig);

const compiler = webpack(compilerConfig);
const devServer = new WebpackDevServer(compiler, devServerConfig);
devServer.listen(devServerConfig.port, devServerConfig.host, (err) => {
  if (err) {
    throw err;
  }
});
