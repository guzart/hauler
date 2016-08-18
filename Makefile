
build_gem:
	gem build hauler.gemspec

publish_gem: build_gem
	ls -t *.gem | head | xargs gem push && rm *.gem

publish_npm:
	npm run build
	cd dist/
	npm publish

.PHONY: all;
