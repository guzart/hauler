
const appName = '<%= Rails.application.class.parent_name.underscore %>';
const hauler = require('hauler');
const env = hauler.getEnvName();

const config = hauler.getCompilerConfig(env, __dirname, appName);
module.exports = config;
