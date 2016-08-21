export type Hash = {[name: string]: any};

export type HostInfo = {
  host: string,
  port: number,
};

export type ProjectConfig = {
  appName?: string,
  entries?: WebpackEntry,
  javascriptLoader?: WebpackLoader,
  sassLoader?: WebpackLoader,
  fontLoader?: WebpackLoader,
  imageLoader?: WebpackLoader,
  jsonLoader?: WebpackLoader,
  prependPlugins?: Array<WebpackPlugin>,
  plugins?: Array<WebpackPlugin>,
  appendPlugins?: Array<WebpackPlugin>,
  publicPath?: string,
  devServer?: WebpackDevServerConfig,
  compiler?: WebpackConfig,
};

export type DevServerConfigFactory = (env: string) => WebpackDevServerConfig;

export type ProjectConfigFactory = (env: string) => ProjectConfig;
