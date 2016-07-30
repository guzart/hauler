module Spiral
  module Generators
    #:nodoc:
    class InstallGenerator < ::Rails::Generators::Base
      desc 'Copy Spiral default files'
      source_root File.expand_path('../templates', __FILE__)

      def copy_config
        template 'config/spiral.js'
      end

      def copy_npm_package_json
        has_package_json = File.exist?(Rails.root.join('package.json'))
        template 'package.json' if !has_package_json
      end

      # def add_npm_start_script
      # end
    end
  end
end
