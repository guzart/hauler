// @flow

export type WebpackDevServerStatsConfig = {
  colors?: boolean,
  hash?: boolean,
  version?: boolean,
  timings?: boolean,
  chunks?: boolean,
  chunkModules?: boolean,
  modules?: boolean,
  children?: boolean,
  cached?: boolean,
  reasons?: boolean,
  source?: boolean,
  errorDetails?: boolean,
  chunkOrigins?: boolean,
};

export type WebpackDevServerConfig = {
  contentBase?: string,
  quiet?: boolean,
  noInfo?: boolean,
  host?: string,
  port?: number,
  hot?: boolean,
  inline?: boolean,
  publicPath?: string,
  headers?: Object,
  stats?: WebpackDevServerStatsConfig,
};

export type WebpackPlugin = Object;

export type WebpackLoader = {
  test?: Object,
  exclude?: Object,
  include?: Object,
  loader?: string,
  loaders?: Array<string>,
  query?: Object,
};

export type WebpackResolveConfig = {
  alias?: Object,
  root?: string | Array<string>,
  modulesDirectories?: Array<string>,
  fallback?: string | Array<string>,
  extensions?: Array<string>,
  packageMains?: Array<string>,
  packageAlias?: string | Array<string> | Object,
  unsafeCache?: true | RegExp | Array<RegExp>,
};

export type WebpackResolveLoaderConfig = WebpackResolveConfig & {
  moduleTemplates?: Array<string>,
};


export type WebpackModuleConfig = {
  loaders?: Array<WebpackLoader>;
  preLoaders?: Array<WebpackLoader>;
  postLoaders?: Array<WebpackLoader>;
  noParse?: Object | Array<Object>;
}

export type WebpackOutputConfig = {
  filename?: string,
  path?: string,
  publicPath?: string,
  chunkFilename?: string,
  sourceMapFilename?: string,
  devtoolModuleFilenameTemplate?: string,
  devtoolFallbackModuleFilenameTemplate?: string,
  devtoolLineToLine?: {
    test?: Object,
    include?: Object,
    exclude?: Object,
  },
  hotUpdateChunkFilename?: string,
  hotUpdateMainFilename?: string,
  jsonpFunction?: string,
  hotUpdatefunction?: string,
  pathinfo?: boolean,
  library?: string,
  libraryTarget?: 'var' | 'this' | 'commonjs' | 'commonjs2' | 'amd' | 'umd',
  umdNamedDefine?: boolean,
  sourcePrefix?: string,
  crossOriginLoading?: false | 'anonymous' | 'use-credentials',
};

export type WebpackEntry = string | Array<string> | { [key: string]: WebpackEntry };

export type WebpackConfig = {
  context?: string,
  entry?: WebpackEntry,
  output?: WebpackOutputConfig,
  module?: WebpackModuleConfig,
  resolve?: WebpackResolveConfig,
  resolveLoader?: WebpackResolveLoaderConfig,
  externals?: Array<any>,
  target?: 'web' | 'webworker' | 'node' | 'async-node' | 'node-webkit' | 'electron',
  bail?: boolean,
  profile?: boolean,
  cache?: boolean,
  watch?: boolean,
  watchOptions?: {
    aggregateTimeout?: number,
    poll?: boolean,
  },
  debug?: boolean,
  devtool?: string,
  devServer?: WebpackDevServerConfig,
  node?: Object,
  amd?: Object,
  loader?: any,
  recordsPath?: string,
  recordsInputPath?: string,
  recordsOutputPath?: string,
  plugins?: Array<WebpackPlugin>,
};
