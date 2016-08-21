#!/usr/bin/env node
// @flow

import { getAppName, getCompilerConfig, getDevServerConfig, getEnvName } from '../index';

const env = getEnvName();
const railsRoot = process.argv[2] || process.cwd();
const appName = process.argv[3] || getAppName(railsRoot);

const devServerConfig = getDevServerConfig(env, railsRoot, appName);
const compilerConfig = getCompilerConfig(env, railsRoot, appName);
const config = { devServerConfig, compilerConfig };
const output = JSON.stringify(config);

process.stdout.write(output);
