// @flow

export function extractCompilerConfig(config: ProjectConfig): WebpackConfig {
  // TODO: parse paths, extract publicpath, etc
  return config.compiler || {};
}

export function extractDevServerConfig(config: ProjectConfig): WebpackDevServerConfig {
  // TODO: parse paths, extract publicPath, etc
  return config.devServer || {};
}
