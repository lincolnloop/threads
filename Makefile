NPM_BIN := $(shell pwd)/node_modules/.bin


build:
	# Make build directory
	mkdir -p $@

#
# ASSETS
# ======

build/assets: build
	# Just symlink them. No processing necessary
	ln -sf ../client/assets $@

assets: build/assets



#
# CSS
# ====

# default args to node-sass
SASS_ARGS = --include-path client/scss
WITH_SOURCEMAPS = --source-map=true --source-map-contents=true --source-map-embed=true
AUTOPREFIX_CMD = $(NPM_BIN)/postcss --use autoprefixer --autoprefixer.browsers "last 2 versions"

ifdef watch
	debug = 1
	SASS_ARGS += --watch
endif

# Default to production build
buildcss = $(NPM_BIN)/node-sass $(1) $(SASS_ARGS) --output-style compressed \
	   | $(AUTOPREFIX_CMD) > $(2)

ifdef debug
buildcss = $(NPM_BIN)/node-sass $(1) $(SASS_ARGS) $(WITH_SOURCEMAPS) > $(2)
ifdef autoprefix
# postcss does not support sourcemaps https://github.com/code42day/postcss-cli/issues/3
buildcss = $(NPM_BIN)/node-sass $(1) $(SASS_ARGS) | $(AUTOPREFIX_CMD)  > $(2)
endif
endif




build/threads.css: FORCE build
	$(call buildcss,client/scss/app.scss,$@)

css: build/threads.css

#
# JAVASCRIPT
# ==========
# default to production build
buildjs = $(NPM_BIN)/browserify $(1) \
	  | $(NPM_BIN)/uglifyjs -m -c warnings=false > $(2)

ifdef debug
buildjs = $(NPM_BIN)/browserify $(1) -o $(2) --debug
endif

ifdef watch
buildjs = $(NPM_BIN)/watchify $(1) -o $(2) --debug
endif


build/threads.js: FORCE build
	$(call buildjs,client/index.js,$@)

js: build/threads.js

clean:
	rm -rf build/*

all: assets css js html


# Will always trigger a rebuild.
# Needed since a single target can be built multiple ways (debug, watch, etc.)
FORCE:

.PHONY: all clean css js html assets
