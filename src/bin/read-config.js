#!/usr/bin/env node
// @flow
'use strict';

const railsRoot = process.argv[2];

const hauler = require('../index');
const env = hauler.getEnvName();

const devServerConfig = hauler.getDevServerConfig(env, railsRoot);
const compilerConfig = hauler.getCompilerConfig(env, railsRoot);
const config = { devServerConfig, compilerConfig };
const output = JSON.stringify(config);

process.stdout.write(output);
