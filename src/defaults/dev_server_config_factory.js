// @flow
'use strict';

function defaultConfigFactory() {
  return {
    quiet: false,
    noInfo: false,
    host: 'localhost',
    port: 3001,
    hot: true,
    inline: true,
    publicPath: '/assets/',
    headers: { 'AccessControl-Allow-Origin': '*' },
    stats: {
      colors: true,
      chunks: true,
      chunkModules: true,
      timings: true,
    },
  };
}

module.exports = defaultConfigFactory;
