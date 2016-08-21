
const hauler = require('hauler');

const env = hauler.getEnvName();
const railsRoot = __dirname;
const appName = hauler.getAppName(railsRoot);

module.exports = hauler.getCompilerConfig(env, railsRoot, appName);
