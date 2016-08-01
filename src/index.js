// @flow
'use strict';

// NOTE: This code is executed in a Gem, which makes any npm package unavailable

const devServerDefaultsFactory = require('./defaults/dev_server_config_factory');
const projectDefaultsFactory = require('./defaults/project_config_factory');
const utils = require('./utils');

function extractHostInfo(devServerConfig: WebpackDevServerConfig): HostInfo {
  const hostInfo = { host: devServerConfig.host, port: devServerConfig.port };
  return utils.merge(devServerDefaultsFactory.defaultHostInfo(), hostInfo);
}

function extractLoaders(config: ProjectConfig): Array<WebpackLoader> {
  return utils.compact([
    config.javascriptLoader,
    config.sassLoader,
    config.fontLoader,
    config.imageLoader,
  ]);
}

function extractResolve(config: ProjectConfig): WebpackResolveConfig {
  const resolve = config.compiler && config.compiler.resolve;
  const root = resolve && resolve.root || '';
  return utils.deepMerge(resolve, { root: utils.railsPath(root) });
}

function extractPlugins(config: ProjectConfig): Array<WebpackPlugin> {
  const prepend = config.prependPlugins || [];
  const plugins = config.plugins || [];
  const appendPlugins = config.appendPlugins || [];
  return prepend.concat(plugins).concat(appendPlugins);
}

function extractModule(config: ProjectConfig): WebpackModuleConfig {
  const module = config.compiler && config.compiler.module;
  return utils.deepMerge(module, {
    loaders: extractLoaders(config),
  });
}

function extractOutput(
  config: ProjectConfig,
  hostInfo: HostInfo
): WebpackOutputConfig {
  const output = config.compiler && config.compiler.output || {};
  const path = output.path || '';
  return utils.deepMerge(output, {
    path: utils.railsPath(path),
    publicPath: utils.formatPublicPath(config.publicPath, hostInfo),
  });
}

function parseToCompilerConfig(
  config: ProjectConfig,
  hostInfo: HostInfo
): WebpackConfig {
  return {
    entry: utils.railsPath(config.entries),
    output: extractOutput(config, hostInfo),
    module: extractModule(config),
    plugins: extractPlugins(config),
    resolve: extractResolve(config),
  };
}

function extractPublicPath(config: WebpackDevServerConfig): string {
  const publicPath = config.publicPath;
  if (publicPath == null) {
    return '';
  }

  if (publicPath.indexOf('http') !== -1) {
    return publicPath;
  }

  const host = config.host || 'localhost';
  const port = config.port || 30001;
  return `http://${host}:${port}/${publicPath.replace(/^\//, '')}`;
}

function prepareDevServerConfig(config: WebpackDevServerConfig): WebpackDevServerConfig {
  const output = Object.assign({}, config, {
    publicPath: extractPublicPath(config),
  });

  return output;
}

function getProjectConfig(): ProjectConfig {
  if (!getProjectConfig.config) {
    const projectConfig: ProjectConfig = require(utils.railsPath('~config/hauler.js'));
    getProjectConfig.config = projectConfig;
  }

  return getProjectConfig.config;
}

/**
 * Returns a factory for getting the project webpack dev server configuration using the
 * value of the `devServer` property in the result of `{Rails.root}/config/hauler.js`
 */
function webpackDevServerConfigFactory(defaultsFactory: DevServerConfigFactory) {
  return (env: string): WebpackDevServerConfig => {
    const defaultDevServerConfig = defaultsFactory(env);
    const projectDevServerConfig = getProjectConfig().devServer;
    const devServerConfig = utils.deepMerge(defaultDevServerConfig, projectDevServerConfig);
    return prepareDevServerConfig(devServerConfig);
  };
}

function webpackCompilerConfigFactory(
  defaultsFactory: ProjectConfigFactory,
  devServerConfigFactory: DevServerConfigFactory
) {
  return (env: string) => {
    const devServerConfig = devServerConfigFactory(env);
    const hostInfo = extractHostInfo(devServerConfig);

    const defaultProjectConfig = defaultsFactory(env);
    const haulerProjectConfig = utils.deepMerge(defaultProjectConfig, getProjectConfig());
    const webpackConfig = parseToCompilerConfig(haulerProjectConfig, hostInfo);
    return utils.deepMerge(webpackConfig, getProjectConfig().compiler || {});
  };
}

function getDevServerConfigFactory() {
  return webpackDevServerConfigFactory(devServerDefaultsFactory);
}

function getCompilerConfigFactory() {
  const devServerConfigFactory = getDevServerConfigFactory();
  return webpackCompilerConfigFactory(projectDefaultsFactory, devServerConfigFactory);
}

const Hauler = {
  getCompilerConfig(env: string, railsRoot?: string) {
    if (railsRoot != null) {
      utils.setRailsRoot(railsRoot);
    }

    const configFactory = getCompilerConfigFactory();
    return configFactory(env);
  },

  getDevServerConfig(env: string, railsRoot?: string) {
    if (railsRoot != null) {
      utils.setRailsRoot(railsRoot);
    }

    const configFactory = getDevServerConfigFactory();
    return configFactory(env);
  },
};

module.exports = Hauler;
