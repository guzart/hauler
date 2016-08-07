// @flow

import * as misc from './misc';

function mergeCompilerConfig(
  target: WebpackConfig = {},
  source: WebpackConfig = {}
): WebpackConfig {
  const output = misc.merge(target, source);
  return Object.assign(output, {
    output: misc.merge(target.output, source.output),
    module: misc.merge(target.module, source.module),
    resolve: misc.merge(target.resolve, source.resolve),
  });
}

function mergeDevServerConfig(
  target: WebpackDevServerConfig = {},
  source: WebpackDevServerConfig = {}
): WebpackDevServerConfig {
  const output = misc.merge(target, source);
  return Object.assign(output, {
    stats: misc.merge(target.stats, source.stats),
  });
}

export function mergeProjectConfig(target: ProjectConfig, source: ProjectConfig): ProjectConfig {
  const output = misc.merge(target, source);
  return Object.assign(output, {
    entries: source.entries || target.entries || {},
    devServer: mergeDevServerConfig(target.devServer, source.devServer),
    compiler: mergeCompilerConfig(target.compiler, source.compiler),
  });
}
