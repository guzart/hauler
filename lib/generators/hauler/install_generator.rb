module Hauler
  module Generators
    #:nodoc:
    class InstallGenerator < ::Rails::Generators::Base
      desc 'Copy Hauler configuration files'
      source_root File.expand_path('../templates', __FILE__)

      def copy_hauler_initializer
        template 'config/initializers/hauler.rb'
      end

      def copy_hauler_config
        template 'config/hauler.js'
      end

      def copy_example_assets
        has_file = File.exist?(Rails.root.join('app', 'assets', 'index.js'))
        template 'app/assets/index.js' if !has_file
      end

      def copy_babelrc
        template 'babelrc.json', '.babelrc'
      end

      def copy_eslintrc
        template 'eslintrc.json', '.eslintrc.json'
      end

      def copy_sass_lint_yml
        template 'sass-lint.yml', '.sass-lint.yml'
      end

      def copy_package_json
        has_package_json = File.exist?(Rails.root.join('package.json'))
        template 'package.json' if !has_package_json
      end

      def add_node_modules_to_gitignore
        has_gitignore = File.exist?(Rails.root.join('.gitignore'))
        return if !has_gitignore

        has_node_modules = IO.read('.gitignore').include? 'node_modules'
        return if has_node_modules

        inject_into_file '.gitignore', "/node_modules\n", before: /\Z/m
      end

      def copy_webpack_config
        template 'webpack.config.js'
      end

      def install_npm
        generate 'hauler:install_npm'
      end

      private

      def rails_app_name
        Rails.application.class.parent.name
      end
    end
  end
end
