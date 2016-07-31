require 'active_support/concern'
require 'action_view/helpers'

module Hauler
  #:nodoc:
  module AssetTagHelper
    extend ::ActiveSupport::Concern

    include ::ActionView::Helpers

    included do
      def hauler_javascript_include_tag(*sources)
        if Rails.application.config.hauler.dev_server
          # TODO: Get this from the configuration
          return javascript_include_tag('http://localhost:3001/assets/' + sources.first + '.js')
        end

        javascript_include_tag(*sources)
      end

      def hauler_stylesheet_link_tag(*sources)
        return nil if Rails.application.config.hauler.dev_server
        stylesheet_link_tag(*sources)
      end
    end
  end
end
