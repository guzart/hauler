#!/usr/bin/env node --use_strict

const fs = require('fs');

fs.mkdir('dist', function () {
  const pkg = Object.assign({}, require('./package.json'));
  delete pkg.scripts;
  Object.assign(pkg, {
    main: 'index.js',
    bin: {
      'hauler-read-config': 'bin/read-config.js',
      'hauler-server': 'bin/dev-server.js',
      'hauler-update-scripts': 'bin/update-scripts.js'
    }
  });

  fs.writeFileSync('dist/package.json', JSON.stringify(pkg, null, 2));
  fs.writeFileSync('dist/LICENSE.txt', fs.readFileSync('./LICENSE.txt').toString());
  fs.writeFileSync('dist/README.md', fs.readFileSync('./README.md').toString());
});
