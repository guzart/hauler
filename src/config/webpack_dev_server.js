const spiralRails = require('../../index');

function configFactory() {
  return {
    headers: { 'AccessControl-Allow-Origin': '*' },
    host: 'localhost',
    hot: true,
    inline: true,
    // outputPath: '/',
    port: 8080,
    publicPath: '/assets/',
    quiet: false,
    noInfo: false,
    stats: {
      // chunks: true,
      // chunkModules: true,
      colors: true,
      // timings: true,
    },
  };
}

module.exports = spiralRails.webpackDevServerConfigFactory(configFactory);
