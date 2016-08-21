
build_gem:
	gem build hauler.gemspec

build_npm:
  npm run build

publish_gem: build_gem
	ls -t *.gem | head | xargs gem push && rm *.gem

.PHONY: all;
