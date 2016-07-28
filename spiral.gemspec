# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'spiral/version'

Gem::Specification.new do |spec|
  spec.name          = 'spiral-rails'
  spec.version       = Spiral::VERSION
  spec.authors       = ['Arturo Guzman']
  spec.email         = ['arturo@guzart.com']

  spec.summary       = 'Railtie to use webpack as an asset manager'
  spec.description   = <<-TXT
Railtie to generate the files needed to use webpack as a replacement of sprockets
TXT
  spec.homepage      = 'https://github.com/guzart/spiral-rails'
  spec.license       = 'MIT'

  # Prevent pushing this gem to RubyGems.org. To allow pushes either set the 'allowed_push_host'
  # to allow pushing to a single host or delete this section to allow pushing to any host.
  if spec.respond_to?(:metadata)
    spec.metadata['allowed_push_host'] = 'https://rubygems.org'
  else
    raise 'RubyGems 2.0 or newer is required to protect against public gem pushes.'
  end

  spec.files = `git ls-files -z`.split("\x0").reject do |f|
    f.match(%r{^(test|spec|features)/})
  end
  spec.bindir        = 'exe'
  spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
  spec.require_paths = ['lib']

  spec.add_development_dependency 'bundler', '~> 1.12'
  spec.add_development_dependency 'rake', '~> 10.0'
  spec.add_development_dependency 'minitest', '~> 5.0'
end
