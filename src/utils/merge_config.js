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

export function mergeProjectConfig(target: ProjectConfig, source: ProjectConfig): ProjectConfig {
  const output = misc.merge(target, source);
  return Object.assign(output, {
    entries: source.entries || target.entries || {},
    devServer: misc.merge(target.devServer, source.devServer),
    compiler: mergeCompilerConfig(target.compiler, source.compiler),
  });
}
