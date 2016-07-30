require 'rails'
require 'rails/railtie'
require 'active_support/ordered_options'
require 'spiral/asset_tag_helper'
# require 'yaml'
# require 'erb'

module Spiral
  #:nodoc:
  class Railtie < ::Rails::Railtie
    config.spiral = ActiveSupport::OrderedOptions.new
    config.spiral.dev_server = true

    initializer 'spiral.configure_rails_initialization' do
      # yaml = Pathname.new(Rails.root.join('config', 'assets.yml'))
      # assets_config = YAML.load(ERB.new(yaml.read).result) || {}
      # assets_config = assets_config[Rails.env]

      # if config.action_controller.asset_host.blank?
      #   config.action_controller.asset_host = assets_config['asset_host']
      # end

      ::ActiveSupport.on_load :action_view do
        include ::Spiral::AssetTagHelper
      end
    end
  end
end
