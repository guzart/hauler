module.exports = function (wallaby) {
  return {
    files: ['src/**/*.js', '!src/**/*-test.js'],

    tests: ['src/**/*-test.js'],

    compilers: {
      'src/**/*.js': wallaby.compilers.babel()
    },

    env: {
      type: 'node',
      runner: 'node'
    },

    testFramework: 'jest',

    debug: true,
  };
};
