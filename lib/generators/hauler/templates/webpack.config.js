
const hauler = require('hauler');
const env = hauler.getEnvName();

const config = hauler.getCompilerConfig(env, __dirname);
module.exports = config;
