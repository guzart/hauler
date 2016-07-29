module Spiral
  module Generators
    #:nodoc:
    class SetupGenerator < ::Rails::Generators::Base
      desc 'Setup spiral project'
      source_root File.expand_path('../templates', __FILE__)

      NPM_DEV_DEPENDENCIES = <<-TXT.freeze
        babel-core
        babel-eslint
        babel-loader
        babel-plugin-transform-class-properties
        babel-preset-es2015-webpack
        babel-preset-stage-2
        css-loader
        eslint
        eslint-config-airbnb
        eslint-import-resolver-webpack
        eslint-plugin-import
        eslint-plugin-jsx-a11y
        extract-text-webpack-plugin@2.0.0-beta.3
        file-loader
        image-webpack-loader
        immutable-devtools
        offline-plugin
        style-loader
        url-loader
        webpack@2.1.0-beta.20
        webpack-dev-server@2.1.0-beta.0
      TXT

      REACT_NPM_DEV_DEPENDENCIES = <<-TXT.freeze
        babel-plugin-transform-react-constant-elements
        babel-plugin-transform-react-inline-elements
        babel-plugin-transform-react-remove-prop-types
        babel-preset-react
        eslint-plugin-react
        react-hot-loader@2.0.0-alpha-4
        redux-logger
      TXT

      REACT_NPM_DEPENDENCIES = <<-TXT.freeze
        immutable
        react
        react-dom
        react-redux
        redux
        redux-immutable
        redux-saga
        reselect
      TXT

      SASS_NPM_DEPENDENCIES = <<-TXT.freeze
        node-sass
        sass-loader
      TXT

      NPM_DEPENDENCIES = <<-TXT.freeze
        babel-polyfill
        whatwg-fetch
      TXT

      def install_dev_dependencies
        # lint-staged
        # null-loader
        # pre-commit
        # psi
        puts 'Installing NPM dev dependencies...'
        install_deps(NPM_DEV_DEPENDENCIES)
      end

      def install_react_dependencies
        # return if !using_sass
        # babel-plugin-react-intl
        puts 'Installing React NPM dev dependencies...'
        install_deps(REACT_NPM_DEV_DEPENDENCIES)

        # react-helmet
        # react-intl
        # react-router
        # react-router-redux
        # react-router-scroll
        puts 'Installing React NPM dependencies...'
        install_deps(REACT_NPM_DEPENDENCIES, dev: false)
      end

      def install_sass_dependencies
        # return if !using_sass
        puts 'Installing Sass NPM dependencies...'
        install_deps(SASS_NPM_DEPENDENCIES)
      end

      def install_dependencies
        # history
        # intl
        puts 'Installing NPM dependencies...'
        install_deps(NPM_DEPENDENCIES, dev: false)
      end

      private

      def install_deps(list, dev: true)
        flag = dev ? '-D' : '-S'
        `npm install #{flag} #{list.gsub(/\s+/m, ' ')}`
      end
    end
  end
end
