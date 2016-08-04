// @flow
'use strict';

const utils = require('./utils');

function extractCompilerConfig(config: ProjectConfig): WebpackConfig {
  // TODO: parse paths, extract publicpath, etc
  return config.compiler || {};
}

function extractDevServerConfig(config: ProjectConfig): WebpackDevServerConfig {
  // TODO: parse paths, extract publicPath, etc
  return config.devServer || {};
}

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

function mergeCompilerConfig(
  target?: WebpackConfig,
  source?: WebpackConfig
): WebpackConfig {
  // TODO: smart merge
  return utils.deepMerge(target, source);
}

function mergeDevServerConfig(
  target?: WebpackDevServerConfig,
  source?: WebpackDevServerConfig
): WebpackDevServerConfig {
  // TODO: smart merge
  return utils.deepMerge(target, source);
}

function mergeLoaders(target: ProjectConfig, source: ProjectConfig): ProjectConfig {
  const loadersKeys = ['javascriptLoader', 'sassLoader', 'fontLoader', 'imageLoader'];
  const output = {};
  loadersKeys.forEach(key => {
    output[key] = utils.deepMerge(target[key], source[key]);
  });
  return output;
}

function mergeProjectConfig(target: ProjectConfig, source: ProjectConfig): ProjectConfig {
  const output = utils.merge(target, source);
  Object.assign(output, mergeLoaders(target, source));
  Object.assign(output, {
    entries: source.entries || target.entries,
    devServer: mergeDevServerConfig(target.devServer, source.devServer),
    compiler: mergeCompilerConfig(target.compiler, source.compiler),
  });
  return output;
}

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
    const config = mergeProjectConfig(projectDefaults, projectConfig);
    return config;
  };
}

function setRailsRoot(railsRoot?: string): void {
    if (railsRoot != null) {
      utils.setRailsRoot(railsRoot);
    }
}

function getConfig(env: string, railsRoot?: string) {
  setRailsRoot(railsRoot);
  const configFactory = getConfigFactory();
  return configFactory(env);
}

function getDevServerConfig(env: string, railsRoot?: string): WebpackDevServerConfig {
  const config = getConfig(env, railsRoot);
  return extractDevServerConfig(config);
}

function getCompilerConfig(env: string, railsRoot?: string): WebpackConfig {
  const config = getConfig(env, railsRoot);
  return extractCompilerConfig(config);
}

const hauler = {
  getCompilerConfig,
  getConfig,
  getDevServerConfig,
  getEnvName: utils.getEnvName,
};

module.exports = hauler;
