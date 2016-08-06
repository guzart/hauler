// @flow

let railsRoot = process.cwd();

export function setRailsRoot(newRailsRoot: string) {
  railsRoot = newRailsRoot;
}

export function pathJoin(...pieces: Array<?string>): string {
  const output = [];
  if (pieces[0]) {
    const firstPiece = pieces[0].replace(/\s+|[\s\/]+$/g, '');
    output.push(firstPiece);
  }

  pieces.slice(1).forEach(piece => {
    if (piece == null) {
      return;
    }

    const cleanPiece = piece.replace(/^[\s\/]+|[\/\s]+$/g, '');
    output.push(cleanPiece);
  });

  return output.join('/');
}

export function preparePublicPath(publicPath: ?string): string {
  if (publicPath == null) {
    return '';
  }

  return publicPath.replace(/^\/|\/$/g, '');
}

export function getHostname(hostInfo: HostInfo): string {
  if ([80, 443].indexOf(hostInfo.port) === -1) {
    return `${hostInfo.host}:${hostInfo.port}`;
  }

  return hostInfo.host;
}

export function formatPublicPath(publicPath: ?string, hostInfo: HostInfo): string {
  if (publicPath && publicPath.indexOf('//') !== -1) {
    return publicPath;
  }

  const protocol = hostInfo.port === 443 ? 'https' : 'http';
  const host = getHostname(hostInfo);
  const pathname = preparePublicPath(publicPath);
  return `${protocol}://${host}/${pathname}/`;
}

export function railsPath(value: any): any {
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
