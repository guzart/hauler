jest.disableAutomock();

const utils = require('../extract_config');
const pathUtils = require('../path');

describe('extractDevServerConfig', () => {
  let projectConfigFactory;
  let projectConfig;

  beforeEach(() => {
    projectConfigFactory = require('../../defaults/project_config_factory').default;
    projectConfig = projectConfigFactory('development');
  });

  describe('contentBase', () => {
    it('resolves to railsRoot', () => {
      pathUtils.setRailsRoot('/var/www/hauler');
      projectConfig.devServer.contentBase = '~lib/assets';
      const config = utils.extractDevServerConfig(projectConfig);
      expect(config.contentBase).toBe('/var/www/hauler/lib/assets');
    });
  });

  describe('publicPath', () => {
    it('defaults to http://localhost:3001/assets', () => {
      const config = utils.extractDevServerConfig({});
      expect(config.publicPath).toBe('http://localhost:3001/assets');
    });

    it('leaves a full URL intact', () => {
      Object.assign(projectConfig.devServer, { host: 'hauler.test', port: 8080 });
      projectConfig.publicPath = 'https://my.hauler.test:4005/my-assets';
      const config = utils.extractDevServerConfig(projectConfig);
      expect(config.publicPath).toBe('https://my.hauler.test:4005/my-assets');
    });

    it('updates to a full URL', () => {
      Object.assign(projectConfig.devServer, { host: 'hauler.test', port: 8080 });
      projectConfig.publicPath = '/my-assets';
      const config = utils.extractDevServerConfig(projectConfig);
      expect(config.publicPath).toBe('http://hauler.test:8080/my-assets');
    });

    it('sets the protocol according to the port', () => {
      Object.assign(projectConfig.devServer, { port: 80 });
      let config = utils.extractDevServerConfig(projectConfig);
      expect(config.publicPath).toMatch('^http://localhost/');

      Object.assign(projectConfig.devServer, { port: 443 });
      config = utils.extractDevServerConfig(projectConfig);
      expect(config.publicPath).toMatch('^https://localhost/');
    });
  });
});

describe('extractCompilerConfig', () => {
  let projectConfigFactory;
  let projectConfig;

  beforeEach(() => {
    pathUtils.setRailsRoot('/var/www/hauler');
    projectConfigFactory = require('../../defaults/project_config_factory').default;
    projectConfig = projectConfigFactory('development');
  });

  it('resolves #context to railsRoot', () => {
    projectConfig.compiler.context = '~';
    const config = utils.extractCompilerConfig(projectConfig);
    expect(config.context).toBe('/var/www/hauler/');
  });

  it('assigns projectConfig#entries to #entry', () => {
    projectConfig.entries = { main: 'main.js' };
    const config = utils.extractCompilerConfig(projectConfig);
    expect(config.entry).toEqual({ main: 'main.js' });
  });

  it('resolves #entry to railsRoot', () => {
    projectConfig.entries = { main: '~lib/assets/hauler/main.js', counter: './counter' };
    const config = utils.extractCompilerConfig(projectConfig);
    expect(config.entry).toEqual({
      main: '/var/www/hauler/lib/assets/hauler/main.js',
      counter: './counter',
    });
  });

  it('resolves #output.path to railsRoot', () => {
    projectConfig.compiler.output.path = '~public/assets';
    const config = utils.extractCompilerConfig(projectConfig);
    expect(config.output.path).toBe('/var/www/hauler/public/assets');
  });

  it('resolves #output.publicPath to a full Url using the devServer', () => {
    projectConfig.publicPath = '/test-assets';
    Object.assign(projectConfig.devServer, { host: 'asset-host', port: 4005 });
    const config = utils.extractCompilerConfig(projectConfig);
    expect(config.output.publicPath).toBe('http://asset-host:4005/test-assets');
  });

  describe('#module.loaders', () => {
    it('extracts the loaders from the project config', () => {
      Object.assign(projectConfig, {
        javascriptLoader: 'js',
        sassLoader: 'sass',
        fontLoader: 'font',
        imageLoader: 'image',
      });
      const config = utils.extractCompilerConfig(projectConfig);
      expect(config.module.loaders).toEqual(['js', 'sass', 'font', 'image']);
    });

    it('removes blank loaders', () => {
      Object.assign(projectConfig, {
        javascriptLoader: 'js',
        sassLoader: null,
        fontLoader: null,
        imageLoader: 'image',
      });
      const config = utils.extractCompilerConfig(projectConfig);
      expect(config.module.loaders).toEqual(['js', 'image']);
    });

    it('appends loaders in #compiler.module.loaders', () => {
      Object.assign(projectConfig, {
        javascriptLoader: 'js', sassLoader: null, fontLoader: null, imageLoader: null,
      });
      projectConfig.module = { loaders: ['other'] };
      const config = utils.extractCompilerConfig(projectConfig);
      expect(config.module.loaders).toEqual(['js', 'other']);
    });
  });
});
