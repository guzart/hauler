// @flow
export type Hash = {[name: string]: any};

const railsRoot = process.cwd();

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

  return pathJoin(railsRoot, value);
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

module.exports = {
  pathJoin,
  railsPath,
  compact,
  merge,
  deepMerge,
  omit,
};
