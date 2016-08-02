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
          entries = hauler_webpack_config.try(:[], 'compilerConfig').try(:[], 'entry')
          return [] if entries.blank?

          if entries.is_a?(Array)
            return entries.map { |e| File.basename(e).gsub(/\.(css|js)$/, '') }
          end

          return entries.keys if entries.respond_to?(:keys)

          []
        end

        def hauler_entry?(path)
          entry = path.gsub(/\.(css|js)$/, '')
          hauler_entries_names.include?(entry)
        end

        def hauler_public_path
          output_config = hauler_webpack_config.try(:[], 'compilerConfig').try(:[], 'output')
          public_path = output_config.try(:[], 'publicPath')
          return '' if public_path.blank?
          'http://localhost:3000/assets'.gsub(%r{/$}, '')
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
          options = sources.extract_options!.stringify_keys
          output = sources.map do |source|
            next if hauler_entry?(source)
            orig_stylesheet_link_tag(source, options)
          end
          output.compact.join("\n").html_safe
        end
      end
    end
  end
end
