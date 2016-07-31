
const spiralRails = require('spiral-rails');
const env = String(process.env.RAILS_ENV || process.env.NODE_ENV);

module.exports = spiralRails.getCompilerConfig(env);
