// @flow

import * as utils from './utils';

// function extractHostInfo(devServerConfig: WebpackDevServerConfig): HostInfo {
//   const hostInfo = { host: devServerConfig.host, port: devServerConfig.port };
//   return utils.merge(devServerDefaultsFactory.defaultHostInfo(), hostInfo);
// }

// function extractLoaders(config: ProjectConfig): Array<WebpackLoader> {
//   return utils.compact([
//     config.javascriptLoader,
//     config.sassLoader,
//     config.fontLoader,
//     config.imageLoader,
//   ]);
// }
//
// function extractResolve(config: ProjectConfig): WebpackResolveConfig {
//   const resolve = config.compiler && config.compiler.resolve;
//   const root = resolve && resolve.root || '';
//   return utils.deepMerge(resolve, { root: utils.railsPath(root) });
// }

// function extractPlugins(config: ProjectConfig): Array<WebpackPlugin> {
//   const prepend = config.prependPlugins || [];
//   const plugins = config.plugins || [];
//   const appendPlugins = config.appendPlugins || [];
//   return prepend.concat(plugins).concat(appendPlugins);
// }
//
// function extractModule(config: ProjectConfig): WebpackModuleConfig {
//   const module = config.compiler && config.compiler.module;
//   return utils.deepMerge(module, {
//     loaders: extractLoaders(config),
//   });
// }

// function extractOutput(
//   config: ProjectConfig,
//   hostInfo: HostInfo
// ): WebpackOutputConfig {
//   const output = config.compiler && config.compiler.output || {};
//   const path = output.path || '';
//   return utils.deepMerge(output, {
//     path: utils.railsPath(path),
//     publicPath: utils.formatPublicPath(config.publicPath, hostInfo),
//   });
// }

// function parseToCompilerConfig(
//   config: ProjectConfig,
//   hostInfo: HostInfo
// ): WebpackConfig {
//   return {
//     entry: utils.railsPath(config.entries),
//     output: extractOutput(config, hostInfo),
//     module: extractModule(config),
//     plugins: extractPlugins(config),
//     resolve: extractResolve(config),
//   };
// }

/**
 * Returns a factory for getting the project webpack dev server configuration using the
 * value of the `devServer` property in the result of `{Rails.root}/config/hauler.js`
 */
// function webpackDevServerConfigFactory(defaultsFactory: DevServerConfigFactory) {
//   return (env: string): WebpackDevServerConfig => {
//     const defaultDevServerConfig = defaultsFactory(env);
//     const projectDevServerConfig = getProjectConfig().devServer;
//     const devServerConfig = utils.deepMerge(defaultDevServerConfig, projectDevServerConfig);
//     return prepareDevServerConfig(devServerConfig);
//   };
// }

// function webpackCompilerConfigFactory(
//   defaultsFactory: ProjectConfigFactory,
//   devServerConfigFactory: DevServerConfigFactory
// ) {
//   return (env: string) => {
//     const devServerConfig = devServerConfigFactory(env);
//     const hostInfo = extractHostInfo(devServerConfig);
//
//     const defaultProjectConfig = defaultsFactory(env);
//     const haulerProjectConfig = utils.deepMerge(defaultProjectConfig, getProjectConfig());
//     const webpackConfig = parseToCompilerConfig(haulerProjectConfig, hostInfo);
//     return utils.deepMerge(webpackConfig, getProjectConfig().compiler || {});
//   };
// }

// -------------------------------------------
// ----- ABOVE SHOULD BE MOVED TO UTILS ------
// -------------------------------------------

function getProjectConfig(env: string): ProjectConfig {
  const projectConfigFactory = require(utils.railsPath('~config/hauler.js'));
  return projectConfigFactory(env);
}

function getProjectDefaults(env: string): ProjectConfig {
  const projectDefaultsFactory = require('./defaults/project_config_factory');
  return projectDefaultsFactory(env);
}

function getConfigFactory(): ProjectConfigFactory {
  return (env: string) => {
    const projectConfig = getProjectConfig(env);
    const projectDefaults = getProjectDefaults(env);
    const config = utils.mergeProjectConfig(projectDefaults, projectConfig);
    return config;
  };
}

function setRailsRoot(railsRoot?: string): void {
    if (railsRoot != null) {
      utils.setRailsRoot(railsRoot);
    }
}

export function getConfig(env: string, railsRoot?: string) {
  setRailsRoot(railsRoot);
  const configFactory = getConfigFactory();
  return configFactory(env);
}

export function getDevServerConfig(env: string, railsRoot?: string): WebpackDevServerConfig {
  const config = getConfig(env, railsRoot);
  return utils.extractDevServerConfig(config);
}

export function getCompilerConfig(env: string, railsRoot?: string): WebpackConfig {
  const config = getConfig(env, railsRoot);
  return utils.extractCompilerConfig(config);
}

export { getEnvName } from './utils';
