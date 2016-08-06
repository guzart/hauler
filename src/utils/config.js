// @flow

import * as misc from './misc';

function mergeCompilerConfig(
  target?: WebpackConfig,
  source?: WebpackConfig
): WebpackConfig {
  // TODO: smart merge
  return misc.deepMerge(target, source);
}

function mergeDevServerConfig(
  target?: WebpackDevServerConfig,
  source?: WebpackDevServerConfig
): WebpackDevServerConfig {
  // TODO: smart merge
  return misc.deepMerge(target, source);
}

function mergeLoaders(target: ProjectConfig, source: ProjectConfig): ProjectConfig {
  const loadersKeys = ['javascriptLoader', 'sassLoader', 'fontLoader', 'imageLoader'];
  const output = {};
  loadersKeys.forEach(key => {
    output[key] = misc.deepMerge(target[key], source[key]);
  });
  return output;
}

export function extractCompilerConfig(config: ProjectConfig): WebpackConfig {
  // TODO: parse paths, extract publicpath, etc
  return config.compiler || {};
}

export function extractDevServerConfig(config: ProjectConfig): WebpackDevServerConfig {
  // TODO: parse paths, extract publicPath, etc
  return config.devServer || {};
}

export function mergeProjectConfig(target: ProjectConfig, source: ProjectConfig): ProjectConfig {
  const output = misc.merge(target, source);
  Object.assign(output, mergeLoaders(target, source));
  Object.assign(output, {
    entries: source.entries || target.entries,
    devServer: mergeDevServerConfig(target.devServer, source.devServer),
    compiler: mergeCompilerConfig(target.compiler, source.compiler),
  });
  return output;
}
