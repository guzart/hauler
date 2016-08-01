#!/usr/bin/env node
// @flow
'use strict';

const env = String(process.env.RAILS_ENV || process.env.NODE_ENV);
const railsRoot = process.argv[2];

const Hauler = require('hauler');
const devServerConfig = Hauler.getDevServerConfig(env, railsRoot);
const compilerConfig = Hauler.getCompilerConfig(env, railsRoot);
const config = { devServerConfig, compilerConfig };
const output = JSON.stringify(config);

process.stdout.write(output);
