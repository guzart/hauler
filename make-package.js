#!/usr/bin/env node --use_strict

const fs = require('fs');

const pkg = require('./package.json');
delete pkg.scripts;
Object.assign(pkg, {
  main: 'index.js',
});

fs.writeFileSync('dist/package.json', JSON.stringify(pkg, null, 2));
fs.writeFileSync('dist/LICENSE.txt', fs.readFileSync('./LICENSE.txt').toString());
fs.writeFileSync('dist/README.md', fs.readFileSync('./README.md').toString());
