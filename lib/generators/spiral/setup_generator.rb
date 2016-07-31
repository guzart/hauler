module Spiral
  module Generators
    #:nodoc:
    class SetupGenerator < ::Rails::Generators::Base
      desc 'Setup spiral project'
      source_root File.expand_path('../templates', __FILE__)

      NPM_DEV_DEPENDENCIES = <<-TXT.freeze
        babel-core@6.11.4
        babel-loader@6.2.4
        babel-plugin-transform-class-properties@6.11.5
        babel-preset-es2015@6.9.0
        babel-preset-stage-2@6.11.0
        css-loader@0.23.1
        extract-text-webpack-plugin@1.0.1
        file-loader@0.9.0
        image-webpack-loader@2.0.0
        immutable-devtools@0.0.7
        style-loader@0.13.1
        url-loader@0.5.7
        webpack@1.13.1
        webpack-dev-server@1.14.1
      TXT

      LINTER_DEV_DEPENDENCES = <<-TXT.freeze
        babel-eslint@6.1.2
        eslint@2.13.1
        eslint-config-airbnb@9.0.1
        eslint-import-resolver-webpack@0.4.0
        eslint-plugin-flow-vars@0.5.0
        eslint-plugin-import@1.12.0
        eslint-plugin-jsx-a11y@1.5.5
        eslint-plugin-react@5.2.2
        sass-lint@1.8.2
      TXT

      REACT_NPM_DEV_DEPENDENCIES = <<-TXT.freeze
        babel-plugin-transform-react-constant-elements@6.9.1
        babel-plugin-transform-react-inline-elements@6.8.0
        babel-plugin-transform-react-remove-prop-types@0.2.8
        babel-preset-react@6.11.1
        react-hot-loader@2.0.0-alpha-4
        redux-logger@2.6.1
      TXT

      REACT_NPM_DEPENDENCIES = <<-TXT.freeze
        immutable@3.8.1
        react@15.2.1
        react-dom@15.2.1
        react-redux@4.4.5
        react-router@2.6.1
        react-router-redux@4.0.5
        react-router-scroll@0.2.1
        redux@3.5.2
        redux-immutable@3.0.6
        redux-saga@0.11.0
        reselect@2.5.3
      TXT

      SASS_NPM_DEV_DEPENDENCIES = <<-TXT.freeze
        node-sass@3.8.0
        sass-loader@4.0.0
      TXT

      NPM_DEPENDENCIES = <<-TXT.freeze
        babel-polyfill@6.9.1
        whatwg-fetch@1.0.0
      TXT

      def install_dev_dependencies
        puts 'Installing NPM dev dependencies...'
        install_deps(NPM_DEV_DEPENDENCIES)
      end

      def install_linter_dev_dependencies
        puts 'Installing Linter NPM dev dependencies...'
        install_deps(LINTER_DEV_DEPENDENCES)
      end

      def install_react_dependencies
        puts 'Installing React NPM dev dependencies...'
        install_deps(REACT_NPM_DEV_DEPENDENCIES)

        puts 'Installing React NPM dependencies...'
        install_deps(REACT_NPM_DEPENDENCIES, dev: false)
      end

      def install_sass_dependencies
        puts 'Installing Sass NPM dependencies...'
        install_deps(SASS_NPM_DEV_DEPENDENCIES)
      end

      def install_dependencies
        puts 'Installing NPM dependencies...'
        install_deps(NPM_DEPENDENCIES, dev: false)
      end

      private

      def install_deps(list, dev: true)
        flag = dev ? '--save-dev' : '--save'
        `npm install #{flag} #{list.gsub(/\s+/m, ' ')}`
      end
    end
  end
end
