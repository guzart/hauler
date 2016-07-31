// @flow
// NOTE: This code is executed in a Gem, which makes any npm package unavailable

const compilerDefaultsFactory = require('./defaults/compiler_config_factory');
const devServerDefaultsFactory = require('./defaults/dev_server_config_factory');
const utils = require('./utils');

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
  const modules = resolve && resolve.modules || ['node_modules'];
  return utils.deepMerge(resolve, { modules: utils.railsPath(modules) });
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

function extractOutput(config: ProjectConfig): WebpackOutputConfig {
  const output = config.compiler && config.compiler.output || {};
  const path = output.path || '';
  return utils.deepMerge(output, {
    path: utils.railsPath(path),
  });
}

function parseToCompilerConfig(config: ProjectConfig): WebpackConfig {
  return {
    entry: utils.railsPath(config.entries),
    output: extractOutput(config),
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

const projectConfig: ProjectConfig = require(utils.railsPath('~config/spiral.js'));

/**
 * Returns a factory for getting the project webpack dev server configuration using the
 * value of the `devServer` property in the result of `{Rails.root}/config/spiral.js`
 */
function webpackDevServerConfigFactory(defaultsFactory: DevServerConfigFactory) {
  return (env: string): WebpackDevServerConfig => {
    const defaultDevServerConfig = defaultsFactory(env);
    const projectDevServerConfig = projectConfig.devServer;
    const devServerConfig = utils.deepMerge(defaultDevServerConfig, projectDevServerConfig);
    return prepareDevServerConfig(devServerConfig);
  };
}

function webpackCompilerConfigFactory(defaultsFactory: ProjectConfigFactory) {
  return (env: string) => {
    const defaultProjectConfig = defaultsFactory(env);
    const spiralProjectConfig = utils.deepMerge(defaultProjectConfig, projectConfig);
    const webpackConfig = parseToCompilerConfig(spiralProjectConfig);
    return utils.deepMerge(webpackConfig, projectConfig.compiler || {});
  };
}

const SpiralRails = {
  getCompilerConfigFactory() {
    return webpackCompilerConfigFactory(compilerDefaultsFactory);
  },

  getCompilerConfig(env: string) {
    const configFactory = SpiralRails.getCompilerConfigFactory();
    return configFactory(env);
  },

  getDevServerConfig(env: string) {
    const configFactory = SpiralRails.getDevServerConfigFactory();
    return configFactory(env);
  },

  getDevServerConfigFactory() {
    return webpackDevServerConfigFactory(devServerDefaultsFactory);
  },
};

module.exports = SpiralRails;