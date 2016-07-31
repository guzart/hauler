
build:
	gem build hauler.gemspec

publish_npm:
	npm run build
	cd dist/
	npm publish

.PHONY: all;
