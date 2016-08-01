
const Hauler = require('hauler');
const env = String(process.env.RAILS_ENV || process.env.NODE_ENV);

const config = Hauler.getCompilerConfig(env, __dirname);
module.exports = config;
