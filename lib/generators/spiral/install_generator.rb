module Hauler
  module Generators
    #:nodoc:
    class InstallGenerator < ::Rails::Generators::Base
      desc 'Copy Hauler configuration files'
      source_root File.expand_path('../templates', __FILE__)

      def copy_config_hauler
        template 'config/hauler.js'
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

      def copy_webpack_config
        template 'webpack.config.js'
      end

      def install_npm
        generate 'hauler:install_npm'
      end
    end
  end
end
