NPM_BIN := $(shell pwd)/node_modules/.bin
SRC_DIR = client
BUILD_DIR = build
DIST_DIR = dist


# Make build directory
$(BUILD_DIR):
	mkdir -p $@

#
# ASSETS
# ======

$(BUILD_DIR)/assets: $(BUILD_DIR)
	rsync -av $(SRC_DIR)/assets/ $@

assets: $(BUILD_DIR)/assets

#
# HTML
# ======

$(BUILD_DIR)/index.html: $(SRC_DIR)/index.html $(BUILD_DIR)
	cp -f $< $@

html: $(BUILD_DIR)/index.html

#
# CSS
# ====

# WARNING: The autoprefixer and watch flags can not be used together.
#   It would require an intermediate directory and is not worth the complexity.

# default args to node-sass
CSS_DIR = $(BUILD_DIR)/css
SASS_ARGS = --include-path=$(SRC_DIR)/scss --output=$(CSS_DIR)
WITH_SOURCEMAPS = --source-map=true --source-map-contents=true --source-map-embed=true
AUTOPREFIX_CMD = $(NPM_BIN)/postcss --use=autoprefixer --autoprefixer.browsers "last 2 versions" --replace $(CSS_DIR)/*.css

ifdef watch
	debug = 1
	SASS_ARGS += --watch
endif

# Default to production build
buildcss = $(NPM_BIN)/node-sass $(1) $(SASS_ARGS) --output-style compressed && $(AUTOPREFIX_CMD)

ifdef debug
buildcss = $(NPM_BIN)/node-sass $(1) $(SASS_ARGS) $(WITH_SOURCEMAPS)
ifdef autoprefix
# postcss does not support sourcemaps https://github.com/code42day/postcss-cli/issues/3
buildcss = $(NPM_BIN)/node-sass $(1) $(SASS_ARGS) && $(AUTOPREFIX_CMD)
endif
endif




$(CSS_DIR): FORCE $(BUILD_DIR)
	$(call buildcss,$(SRC_DIR)/scss)

css: $(BUILD_DIR)/css

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


$(BUILD_DIR)/threads.js: FORCE build
	$(call buildjs,$(SRC_DIR)/index.js,$@)

js: $(BUILD_DIR)/threads.js

MANIFEST = $(DIST_DIR)/manifest.txt

# Create versioned directory, sync build into it and create an empty manifest
$(DIST_DIR):
	mkdir -p $@
	rsync -av $(BUILD_DIR)/ $@
	/bin/echo -n > $(MANIFEST)

# Create copies of the files with MD5 hashes
#     The `rev` trickery allows us to search for the last "."
#     in the file name as if it were the first.
$(DIST_DIR)/%: $(DIST_DIR)
	$(eval VERSIONED := $(shell echo $@ | rev | sed "s/\./.$$( md5 -q $@ | cut -c -10 | rev)./" | rev))
	cp $@ $(VERSIONED)
	@echo "$$(echo $@ | cut -d'/' -f2-),$$(echo $(VERSIONED) | cut -d'/' -f2-)" >> $(MANIFEST)


# Get a list of all files that are in `build`
BUILT_FILES := $(shell find ${BUILD_DIR} -type file)


# Convert build/file.ext -> dist/file.ext
version: $(patsubst $(BUILD_DIR)/%,$(DIST_DIR)/%,$(BUILT_FILES))
	node rev_urls.js


ifdef prod
SERVER = usethreads.com
else
SERVER = dev.usethreads.com
endif

upload:
	rsync -avz --chmod=g+w --omit-dir-times --delete \
	$(DIST_DIR)/ $(SERVER):/var/www/$(SERVER)

deploy:
	$(MAKE) clean
	$(MAKE) -j5 all
	$(MAKE) version
	$(MAKE) upload



clean:
	rm -rf $(BUILD_DIR)/*
	rm -rf $(DIST_DIR)/*

all: assets css js html


# Will always trigger a rebuild.
# Needed since a single target can be built multiple ways (debug, watch, etc.)
FORCE:

.PHONY: all clean css js html assets $(DIST_DIR)
