// @flow

export default function defaultConfigFactory() {
  return {
    quiet: false,
    noInfo: false,
    host: 'localhost',
    port: 3001,
    hot: true,
    inline: true,
    headers: { 'AccessControl-Allow-Origin': '*' },
    stats: {
      colors: true,
      chunks: true,
      chunkModules: false,
      timings: true,
    },
  };
}
