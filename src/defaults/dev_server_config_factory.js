// @flow
'use strict';

const DEFAULT_HOST = 'localhost';
const DEFAULT_PORT = 3001;

function defaultConfigFactory() {
  return {
    quiet: false,
    noInfo: false,
    host: DEFAULT_HOST,
    port: DEFAULT_PORT,
    hot: true,
    inline: true,
    headers: { 'AccessControl-Allow-Origin': '*' },
    stats: {
      colors: true,
      chunks: true,
      chunkModules: true,
      timings: true,
    },
  };
}

defaultConfigFactory.defaultHostInfo = (): HostInfo =>
  ({ host: DEFAULT_HOST, port: DEFAULT_PORT });

module.exports = defaultConfigFactory;
