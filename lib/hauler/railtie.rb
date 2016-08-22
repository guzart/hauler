require 'hauler'
require 'rails'
require 'hauler/helpers/hauler_helper'
require 'active_support/core_ext/hash/indifferent_access'

# :nodoc:
module Hauler
  # :nodoc:
  class Railtie < Rails::Railtie
    config.react.camelize_props = true

    config.hauler = ActiveSupport::OrderedOptions.new
    config.hauler.dev_server = false

    config.eager_load_namespaces << Hauler

    initializer 'hauler.helpers' do
      ::ActiveSupport.on_load(:action_view) do
        include Hauler::Helpers::HaulerHelper
      end
    end
  end
end
