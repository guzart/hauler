#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const pkgFilepath = path.join(process.cwd(), 'package.json');
const pkg = require(pkgFilepath);
if (!pkg.scripts) {
  Object.assign(pkg, { scripts: {} });
}

Object.assign(pkg.scripts, {
  start: 'hauler-server $(pwd)',
});

const output = JSON.stringify(pkg, null, 2);
fs.writeFileSync(pkgFilepath, `${output}\n`);
