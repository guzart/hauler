require 'rails'
require 'rails/railtie'
require 'active_support/ordered_options'
require 'spiral/asset_tag_helper'

module Spiral
  #:nodoc:
  class Railtie < ::Rails::Railtie
    config.spiral = ActiveSupport::OrderedOptions.new
    config.spiral.dev_server = true

    initializer 'spiral.configure_rails_initialization' do
      ::ActiveSupport.on_load :action_view do
        include ::Spiral::AssetTagHelper
      end
    end
  end
end
