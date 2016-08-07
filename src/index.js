// @flow

import * as utils from './utils';

function getProjectConfig(env: string): ProjectConfig {
  const projectConfigFactory = require(utils.railsPath('~config/hauler.js'));
  return projectConfigFactory(env);
}

function getProjectDefaults(env: string): ProjectConfig {
  const projectDefaultsFactory = require('./defaults/project_config_factory');
  return projectDefaultsFactory.default(env);
}

function getConfigFactory(): ProjectConfigFactory {
  return (env: string) => {
    const projectDefaults = getProjectDefaults(env);
    const projectConfig = getProjectConfig(env);
    const config = utils.mergeProjectConfig(projectDefaults, projectConfig);
    return config;
  };
}

export function getConfig(env: string, railsRoot?: string) {
  if (railsRoot != null) {
    utils.setRailsRoot(railsRoot);
  }

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
