require 'active_support/concern'
require 'action_view/helpers'

module Spiral
  #:nodoc:
  module AssetTagHelper
    extend ::ActiveSupport::Concern

    include ::ActionView::Helpers

    included do
      def spiral_javascript_include_tag(*sources)
        javascript_include_tag(*sources)
      end

      def spiral_stylesheet_link_tag(*sources)
        return nil if Rails.application.config.spiral.dev_server
        stylesheet_link_tag(*sources)
      end
    end
  end
end
