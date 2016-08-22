import url from 'url';

function getHotEntryPoint(publicPath: string): string {
  const uri = url.parse(publicPath);
  uri.pathname = '';
  return `webpack-dev-server/client?${uri.format()}`;
}

export function makeHotReloadableEntries(entries: WebpackEntry, publicPath: string): WebpackEntry {
  if (typeof entries === 'string') {
    return [
      getHotEntryPoint(publicPath),
      'webpack/hot/only-dev-server',
      entries,
    ];
  }

  if (Array.isArray(entries)) {
    return [getHotEntryPoint(publicPath)].concat(entries);
  }

  if (entries.constructor === Object) {
    const output = {};
    Object.keys(entries).forEach(key => {
      let hotEntry = makeHotReloadableEntries(entries[key], publicPath);
      output[key] = hotEntry;
    });

    return output;
  }

  return entries;
}
