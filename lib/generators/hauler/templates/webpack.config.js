
const Hauler = require('hauler');
const env = String(process.env.RAILS_ENV || process.env.NODE_ENV);

module.exports = Hauler.getCompilerConfig(env);
