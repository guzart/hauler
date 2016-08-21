#!/usr/bin/env node
// @flow

import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { getAppName, getCompilerConfig, getDevServerConfig, getEnvName } from '../index';

const env = getEnvName();
const railsRoot = process.argv[2] || process.cwd();
const appName = process.argv[3] || getAppName(railsRoot);

const devServerConfig = getDevServerConfig(env, railsRoot, appName);
const compilerConfig = getCompilerConfig(env, railsRoot, appName);

// console.log(devServerConfig);
// console.log(compilerConfig);

const compiler = webpack(compilerConfig);
const devServer = new WebpackDevServer(compiler, devServerConfig);
devServer.listen(devServerConfig.port, devServerConfig.host, (err) => {
  if (err) {
    throw err;
  }
});
