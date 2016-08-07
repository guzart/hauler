require 'active_support/concern'
require 'action_view/helpers'

module Hauler
  module Helpers
    #:nodoc:
    module HaulerHelper
      extend ::ActiveSupport::Concern

      include ::ActionView::Helpers

      included do
        def hauler_dev_server?
          Rails.application.config.hauler.dev_server
        end

        def hauler_webpack_config
          return nil if !hauler_dev_server?
          @hauler_webpack_config ||= JSON.parse(`hauler-read-config`)
        end

        def hauler_entries_names
          @hauler_entries_names ||= begin
            entries = hauler_webpack_config.try(:[], 'compilerConfig').try(:[], 'entry')
            entries.try(:keys) || []
          end
        end

        def hauler_entry?(path)
          entry = path.gsub(/\.(css|js)$/, '')
          hauler_entries_names.include?(entry)
        end

        def hauler_public_path
          @hauler_public_path ||= begin
            public_path = hauler_webpack_config.try(:[], 'devServerConfig').try(:[], 'publicPath')
            public_path.gsub(%r{/$}, '')
          end
        end

        def hauler_format_entry_path(entry)
          output = entry
          output += '.js' unless entry.end_with?('.js')
          output.gsub(%r{^/}, '')
        end

        alias_method :orig_asset_path, :asset_path

        def hauler_asset_path(path, options = {})
          return nil unless options[:type].to_s == 'javascript'
          return nil unless hauler_dev_server? && hauler_entry?(path)
          [hauler_public_path, hauler_format_entry_path(path)].join('/')
        end

        def asset_path(source, options = {})
          hauler_asset_path(source, options) || orig_asset_path(source, options)
        end

        def path_to_asset(*args)
          asset_path(*args)
        end

        alias_method :orig_stylesheet_link_tag, :stylesheet_link_tag

        def stylesheet_link_tag(*sources)
          return orig_stylesheet_link_tag(*sources) unless hauler_dev_server?
          options = sources.extract_options!.stringify_keys
          sources.map do |source|
            next if hauler_entry?(source)
            orig_stylesheet_link_tag(source, options)
          end.compact.join("\n").html_safe
        end
      end
    end
  end
end
