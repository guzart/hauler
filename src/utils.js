// @flow
export type Hash = {[name: string]: any};

let railsRoot = process.cwd();

function setRailsRoot(newRailsRoot: string) {
  railsRoot = newRailsRoot;
}

function pathJoin(...pieces: Array<?string>): string {
  const firstPiece = (pieces[0] || '').replace(/\/$/, '');
  const output = [firstPiece];
  pieces.slice(1).forEach(piece => {
    if (piece == null) {
      return;
    }

    const cleanPiece = piece.replace(/^\/|\/$/g, '');
    output.push(cleanPiece);
  });

  return output.join('/');
}

function railsPath(value: any): any {
  if (Array.isArray(value)) {
    return value.map(item => railsPath(item));
  }

  if (value instanceof Object) {
    const output = {};
    Object.keys(value).forEach((key) => {
      output[key] = railsPath(value[key]);
    });
    return output;
  }

  if (!/^~/.test(value)) {
    return value;
  }

  return pathJoin(railsRoot, value.replace(/^~/, ''));
}

function compact<A>(list: Array<?A>): Array<A> {
  const output = [];
  list.forEach(item => {
    if (item != null) {
      output.push(item);
    }
  });

  return output;
}

function merge<A: Hash, B: Hash>(a?: A, b?: B): A & B {
  return Object.assign({}, a, b);
}

function deepMerge<A: Hash, B: Hash>(a?: A, b?: B): A & B {
  const output = Object.assign({}, a, b);
  if (a == null || b == null) {
    return output;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    return b;
  }

  const validB = b;
  const keysB = Object.keys(validB);
  keysB.forEach(keyB => {
    const valueA = output[keyB];
    const valueB = validB[keyB];
    if (valueB === undefined) {
      return;
    }

    if (valueA instanceof Object && valueB instanceof Object) {
      Object.assign(output, { [keyB]: deepMerge(valueA, valueB) });
      return;
    }

    Object.assign(output, { [keyB]: valueB });
  });

  return output;
}

function omit(keys: Array<string>, hash: Hash) {
  const output = {};
  Object.keys(hash).forEach((key) => {
    if (keys.indexOf(key) === -1) {
      output[key] = hash[key];
    }
  });
  return output;
}

function getHostname(hostInfo: HostInfo): string {
  if ([80, 443].indexOf(hostInfo.port) === -1) {
    return `${hostInfo.host}:${hostInfo.port}`;
  }

  return hostInfo.host;
}

function preparePublicPath(publicPath: ?string): string {
  if (publicPath == null) {
    return '';
  }

  return publicPath.replace(/^\/|\/$/g, '');
}

function formatPublicPath(publicPath: ?string, hostInfo: HostInfo): string {
  if (publicPath && publicPath.indexOf('//') !== -1) {
    return publicPath;
  }

  const protocol = hostInfo.port === 443 ? 'https' : 'http';
  const host = getHostname(hostInfo);
  const pathname = preparePublicPath(publicPath);
  return `${protocol}://${host}/${pathname}/`;
}

module.exports = {
  pathJoin,
  setRailsRoot,
  railsPath,
  compact,
  merge,
  deepMerge,
  omit,
  formatPublicPath,
};
