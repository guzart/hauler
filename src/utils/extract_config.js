// @flow

import url from 'url';
import { railsPath } from './path';
import { compact } from './misc';

function resolveValuesRailsPath(entries: Object = {}): Object {
  const keys = Object.keys(entries);
  const reducer = (output, key) => Object.assign(output, { [key]: railsPath(entries[key]) });
  return keys.reduce(reducer, {});
}

function extractLoaders(config: ProjectConfig): Array<WebpackLoader> {
  const baseLoaders = compact([
    config.javascriptLoader,
    config.sassLoader,
    config.fontLoader,
    config.imageLoader,
  ]);

  const customLoaders = config.module && config.module.loaders || [];
  return baseLoaders.concat(customLoaders);
}

function extractResolve(config: ProjectConfig): WebpackResolveConfig {
  const resolveConfig = config.compiler && config.compiler.resolve || {};
  return Object.assign(resolveConfig, {
    alias: resolveValuesRailsPath(resolveConfig.alias),
    root: railsPath(resolveConfig.root),
  });
}

function extractPlugins(config: ProjectConfig): Array<WebpackPlugin> {
  const prepend = config.prependPlugins || [];
  const plugins = config.plugins || [];
  const appendPlugins = config.appendPlugins || [];
  return prepend.concat(plugins).concat(appendPlugins);
}

function extractModule(config: ProjectConfig): WebpackModuleConfig {
  const moduleConfig = config.compiler && config.compiler.module || {};
  return Object.assign(moduleConfig, {
    loaders: extractLoaders(config),
  });
}

function formatUrl(urlObject: Object) {
  return url.format(urlObject);
}

function extractPublicPath(config: ProjectConfig): string {
  const pathUrl = url.parse(config.publicPath || '/assets');
  const port = String(config.devServer && config.devServer.port || '3001');

  if (!pathUrl.protocol) {
    pathUrl.protocol = port === '443' ? 'https' : 'http';
  }

  if (!pathUrl.hostname) {
    pathUrl.hostname = config.devServer && config.devServer.host || 'localhost';
  }

  if (!pathUrl.port && port !== '80' && port !== '443') {
    pathUrl.port = port;
  }

  return formatUrl(pathUrl);
}

function extractOutput(config: ProjectConfig): WebpackOutputConfig {
  const outputConfig = config.compiler && config.compiler.output || {};
  return Object.assign(outputConfig, {
    path: railsPath(outputConfig.path),
    publicPath: extractPublicPath(config),
  });
}

function resolveContentBase(contentBase?: string): ?string {
  if (!contentBase) {
    return undefined;
  }

  return railsPath(contentBase);
}

export function extractCompilerConfig(config: ProjectConfig): WebpackConfig {
  const compilerConfig = Object.assign({}, config.compiler);
  return Object.assign({}, compilerConfig, {
    context: railsPath(compilerConfig.context),
    entry: resolveValuesRailsPath(config.entries),
    output: extractOutput(config),
    module: extractModule(config),
    resolve: extractResolve(config),
    plugins: extractPlugins(config),
  });
}

export function extractDevServerConfig(config: ProjectConfig): WebpackDevServerConfig {
  return Object.assign({}, config.devServer, {
    contentBase: resolveContentBase(config.devServer && config.devServer.contentBase),
    publicPath: extractPublicPath(config),
  });
}
