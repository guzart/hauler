// @flow

export * from './path';

export function getEnvName(): string {
  return String(process.env.RAILS_ENV || process.env.NODE_ENV || 'development');
}

export function compact<A>(list: Array<?A>): Array<A> {
  const output = [];
  list.forEach(item => {
    if (item != null) {
      output.push(item);
    }
  });

  return output;
}

export function merge<A: Hash, B: Hash>(a?: A, b?: B): A & B {
  return Object.assign({}, a, b);
}

export function deepMerge<A: Hash, B: Hash>(a?: A, b?: B): A & B {
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

    // TODO: valueB null should overwrite valueA
    if (valueA instanceof Object && valueB instanceof Object) {
      Object.assign(output, { [keyB]: deepMerge(valueA, valueB) });
      return;
    }

    Object.assign(output, { [keyB]: valueB });
  });

  return output;
}

export function omit(keys: Array<string>, hash: Hash) {
  const output = {};
  Object.keys(hash).forEach((key) => {
    if (keys.indexOf(key) === -1) {
      output[key] = hash[key];
    }
  });
  return output;
}
