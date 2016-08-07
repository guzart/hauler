jest.unmock('../merge_config');

const defaults = {
  entries: { main: 'my-main-entry.js' },
  javascriptLoader: { test: 'jsLoader' },
  sassLoader: { test: 'sassLoader' },
  fontLoader: { test: 'fontLoader' },
  imageLoader: { test: 'imageLoader' },
  prependPlugins: ['prepend'],
  plugins: ['plugins'],
  appendPlugins: ['append'],
  publicPath: '/my-assets',
  devServer: {
    stats: { colors: true },
  },
  compiler: {
    output: { filename: '[name]-[hash].js' },
    module: { loaders: [{ test: /\.js$/ }] },
    resolve: { alias: { xyz: '/absolute/path/to/file.js' } },
  },
};

describe('mergeProjectConfig', () => {
  let misc;
  let utils;

  beforeEach(() => {
    misc = require('../misc');
    misc.merge.mockReturnValue({});

    utils = require('../merge_config');
  });

  it('merges the source into the defaults', () => {
    const source = { entries: { main: 'application.js' } };
    utils.mergeProjectConfig(defaults, source);
    expect(misc.merge).toBeCalledWith(defaults, source);
  });

  it('merges the source.devServer into the defaults.devServer', () => {
    const devServer = { contentBase: '/', quiet: true };
    utils.mergeProjectConfig(defaults, { devServer });
    expect(misc.merge).toBeCalledWith(defaults.devServer, devServer);
  });

  it('merges the source.devServer.stats into the defaults.devServer.stats', () => {
    const stats = { hash: true };
    utils.mergeProjectConfig(defaults, { devServer: { stats } });
    expect(misc.merge).toBeCalledWith(defaults.devServer.stats, stats);
  });

  it('merges the source.compiler into the defaults.compiler', () => {
    const compiler = { context: '/', cache: false };
    utils.mergeProjectConfig(defaults, { compiler });
    expect(misc.merge).toBeCalledWith(defaults.compiler, compiler);
  });

  it('merges the source.compiler.output into the defaults.compiler.output', () => {
    const output = { filename: '[name].js', chunkFilename: '[name].chunk.js' };
    utils.mergeProjectConfig(defaults, { compiler: { output } });
    expect(misc.merge).toBeCalledWith(defaults.compiler.output, output);
  });

  it('merges the source.compiler.module into the defaults.compiler.module', () => {
    const module = { loaders: [{ test: /\.css$/ }]  };
    utils.mergeProjectConfig(defaults, { compiler: { module } });
    expect(misc.merge).toBeCalledWith(defaults.compiler.module, module);
  });

  it('merges the source.compiler.resolve into the defaults.compiler.resolve', () => {
    const resolve = { alias: { xyz: './dir' } };
    utils.mergeProjectConfig(defaults, { compiler: { resolve } });
    expect(misc.merge).toBeCalledWith(defaults.compiler.resolve, resolve);
  });
});
