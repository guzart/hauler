export type HostInfo = {
  host: string,
  port: number,
};

export type ProjectConfig = {
  entries?: {[name: string]: string | Array<string>},
  javascriptLoader?: WebpackLoader,
  sassLoader?: WebpackLoader,
  fontLoader?: WebpackLoader,
  imageLoader?: WebpackLoader,
  prependPlugins?: Array<WebpackPlugin>,
  plugins?: Array<WebpackPlugin>,
  appendPlugins?: Array<WebpackPlugin>,
  publicPath?: string,
  devServer?: WebpackDevServerConfig,
  compiler?: WebpackConfig,
};

export type DevServerConfigFactory = (env: string) => WebpackDevServerConfig;

export type ProjectConfigFactory = (env: string) => ProjectConfig;
