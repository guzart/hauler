# Hauler

Replaces the default Rails asset management (Sprockets) with the superior Webpack.

Improve your DX (Developer Experience) by developing your application UI using
JavaScript Components.

1. [Setup](#setup)  
  1. [New Rails Application](#new-rails-application)  
  1. [Existing Rails Application](#existing-rails-applications)
1. [Installation](#installation)
1. [Update](#update)
1. [Usage](#usage)

## Preparation

### New Rails Application

Create your new application skipping all javascript assets and sprockets (where "*my_app*" refers to your app name).

```bash
rails new my_app --skip-javascript --skip-turbolinks --skip-sprockets
```

### Existing Rails Applications

Remove sprockets from your application loaded modules inside the `config/application.rb` file.

If you used the default Rails generator, then replace the line `require 'rails/all'` with:

```ruby
require 'rails'
# Pick the frameworks you want:
require 'active_model/railtie'
require 'active_job/railtie'
require 'active_record/railtie'
require 'action_controller/railtie'
require 'action_mailer/railtie'
require 'action_view/railtie'
# require 'sprockets/railtie'
require 'rails/test_unit/railtie'
```

If you used a custom Rails app generation, just remove the line:

```bash
require 'sprockets/railtie'
```

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'hauler'
```

And then execute:

```bash
bundle
bin/rails generate hauler:install
```

Set your application `config.action_controller.asset_host` using an environment variable.

```bash
export ASSET_HOST="//localhost:8080"
```

```ruby
# config/application.rb
config.action_controller.asset_host = ENV.fetch('ASSET_HOST')
```

## Update

```bash
bin/rails generate hauler:install
```

## Usage

Run your rails server normally:

```bash
bin/rails server
```

In a different terminal window run Webpack dev server:

```bash
npm start
```


## Development

After checking out the repo, run `bin/setup` to install dependencies. Then, run `rake test` to run the tests. You can also run `bin/console` for an interactive prompt that will allow you to experiment.

To install this gem onto your local machine, run `bundle exec rake install`. To release a new version, update the version number in `version.rb`, and then run `bundle exec rake release`, which will create a git tag for the version, push git commits and tags, and push the `.gem` file to [rubygems.org](https://rubygems.org).

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/guzart/hauler.


## License

The gem is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).

# TODO

* add "start" script that runs the hauler.js binary
* install React dynamically, install if present or ask otherwise
* install Sass dynamically, install if present or ask otherwise
* add sensible defaults to the config template
* should be able to append loaders or override them
* one place for editing the asset host
