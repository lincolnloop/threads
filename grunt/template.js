"use strict";

module.exports = {
  dev: {
    files: {
      'build/index.html': ['src/index.html.tpl']
    },
    options: {
      data: {
        js: '/<%= pkg.name %>.js',
        css: '/<%= pkg.name %>.css'
      }
    }
  },
  production: {
    files: {
      'dist/index.html': ['src/index.html.tpl']
    },
    options: {
      data: {
        js: '/<%= pkg.name %>.min.js',
        css: '/<%= pkg.name %>.css'
      }
    }
  }
};