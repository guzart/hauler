#!/usr/bin/env node --use_strict

const fs = require('fs');
const path = require('path');

const pkg = Object.assign({}, require('./package.json'));
delete pkg.scripts;
Object.assign(pkg, {
  main: 'index.js',
});

fs.writeFileSync('dist/package.json', JSON.stringify(pkg, null, 2));
fs.writeFileSync('dist/LICENSE.txt', fs.readFileSync('./LICENSE.txt').toString());
fs.writeFileSync('dist/README.md', fs.readFileSync('./README.md').toString());

fs.mkdirSync('dist/bin');
Object.keys(pkg.bin).forEach(key => {
  const binaryPath = pkg.bin[key];
  fs.writeFileSync(
    path.join('dist', binaryPath),
    fs.readFileSync(binaryPath).toString()
  );
});
