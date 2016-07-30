// NOTE: This code is executed in a Gem, which makes any npm package unavailable

const railsRoot = process.cwd();

function railsPath(value) {
  if (Array.isArray(value)) {
    return value.map((item) => railsPath(item));
  }

  if (value instanceof Object) {
    const output = {};
    Object.keys(value).forEach((key) => {
      output[key] = railsPath(value[key]);
    });
    return output;
  }

  return [railsRoot, value].join('/');
}

function merge(...hashes) {
  const output = {};
  hashes.filter(v => !!v).forEach((hash) => {
    Object.keys(hash).forEach((key) => {
      output[key] = hash[key];
    });
  });
  return output;
}

function deepMergeValues(a, b) {
  if (a instanceof Object && b instanceof Object) {
    const output = a;
    Object.keys(b).forEach((key) => {
      output[key] = deepMergeValues(a[key], b[key]);
    });

    return output;
  }

  return b;
}

function deepMerge(...hashes) {
  const output = {};
  hashes.filter(v => !!v).forEach((hash) => {
    Object.keys(hash).forEach((key) => {
      const currentValue = output[key];
      const value = hash[key];
      if (currentValue === undefined) {
        output[key] = value;
        return;
      }

      output[key] = deepMergeValues(currentValue, value);
    });
  });
  return output;
}

// function omit(keys, hash) {
//   const output = {};
//   Object.keys(hash).forEach((key) => {
//     if (keys.indexOf(key) === -1) {
//       output[key] = hash[key];
//     }
//   });
//   return output;
// }

function extractLoaders(loaders) {
  return [
    loaders.javascriptLoader,
    loaders.sassLoader,
    loaders.fontLoader,
    loaders.imageLoader,
  ].filter(v => !!v);
}

function extractPlugins(plugins) {
  return plugins.prependPlugins.concat(plugins.plugins).concat(plugins.appendPlugins);
}

function formatCompilerConfig(config) {
  return {
    entry: railsPath(config.entries),
    output: deepMerge(config.compiler.output, {
      path: railsPath(config.compiler.output.path),
      // TODO: needs bulletproof parsing
      // TODO: get the url from configuration
      publicPath: `http://localhost:30001/${config.compiler.output.publicPath}`,
    }),
    module: deepMerge(config.compiler.module, {
      loaders: extractLoaders(config.loaders),
    }),
    plugins: extractPlugins(config.plugins),
    resolve: deepMerge(config.compiler.resolve, {
      root: railsPath(config.compiler.resolve.root),
    }),
  };
}

const projectConfig = require(railsPath('config/spiral.js'));

module.exports = {
  webpackDevServerConfigFactory(defaultsFactory) {
    return (env) => {
      const projectDevServerConfig = projectConfig.devServer || {};
      return deepMerge(projectDevServerConfig, defaultsFactory(env));
    };
  },

  webpackCompilerConfigFactory(defaultsFactory) {
    return (env) => {
      const defaults = defaultsFactory(env);
      const spiralConfig = deepMerge(defaults, projectConfig);
      const webpackConfig = formatCompilerConfig(spiralConfig);
      return merge(webpackConfig, projectConfig.compiler);
    };
  },
};
