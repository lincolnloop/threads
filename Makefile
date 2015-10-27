NPM_BIN := $(shell pwd)/node_modules/.bin
BUILD_DIR = build


$(BUILD_DIR):
	# Make build directory
	mkdir -p $@

#
# ASSETS
# ======

$(BUILD_DIR)/assets: $(BUILD_DIR)
	rsync -av client/assets/ $@

assets: $(BUILD_DIR)/assets



#
# CSS
# ====

# WARNING: The autoprefixer and watch flags can not be used together.
#   It would require an intermediate directory and is not worth the complexity.

# default args to node-sass
OUTPUT_DIR = $(BUILD_DIR)/css
SASS_ARGS = --include-path=client/scss --output=$(OUTPUT_DIR)
WITH_SOURCEMAPS = --source-map=true --source-map-contents=true --source-map-embed=true
AUTOPREFIX_CMD = $(NPM_BIN)/postcss --use=autoprefixer --autoprefixer.browsers "last 2 versions" --replace $(OUTPUT_DIR)/*.css

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




$(BUILD_DIR)/css: FORCE $(BUILD_DIR)
	$(call buildcss,client/scss)

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
	$(call buildjs,client/index.js,$@)

js: $(BUILD_DIR)/threads.js


clean:
	rm -rf $(BUILD_DIR)/*

all: assets css js html

VERSION_DIR = $(BUILD_DIR)/versioned
MANIFEST = $(VERSION_DIR)/manifest.txt

# Create versioned directory, sync build into it and create an empty manifest
$(VERSION_DIR): FORCE
	mkdir -p $@
	rsync -av --exclude=versioned $(BUILD_DIR)/ $@
	/bin/echo -n > $(MANIFEST)

# Create copies of the files with MD5 hashes
#     The `rev` trickery allows us to search for the last "."
#     in the file name as if it were the first.
$(VERSION_DIR)/%: $(VERSION_DIR) FORCE
	$(eval VERSIONED := $(shell echo $@ | rev | sed "s/\./.$$( md5 -q $@ | cut -c -10 | rev)./" | rev))
	cp $@ $(VERSIONED)
	@echo "$$(echo $@ | cut -d'/' -f3-),$$(echo $(VERSIONED) | cut -d'/' -f3-)" >> $(MANIFEST)


# Get a list of all files that are in `build` but not `build/versioned`
FILES_TO_VERSION := $(shell find ${BUILD_DIR} -type file -not -path "${BUILD_DIR}/versioned/*")

# Convert build/file.ext -> build/versioned/file.ext
version: $(patsubst $(BUILD_DIR)/%,$(VERSION_DIR)/%,$(FILES_TO_VERSION))
	node rev_css_urls.js




# Will always trigger a rebuild.
# Needed since a single target can be built multiple ways (debug, watch, etc.)
FORCE:

.PHONY: all clean css js html assets build/versioned
