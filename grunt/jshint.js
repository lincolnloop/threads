"use strict";

module.exports = {
  src: [
    'Gruntfile.js',
    'src/*.js',
    'src/app/**/*.js'
  ],
  options: {
    // options here to override JSHint defaults
    globalstrict: true,
    // don't require "new" when using react modules
    newcap: false,
    globals: {
      jQuery: true,
      console: true,
      module: true,
      require: true,
      window: true,
      localStorage: true,
      document: true,
      process: true,
      FormData: true,
      XMLHttpRequest: true,
      // TODO: Fix these
      ohrl: true,
      mixpanel: true,
      log: true,
      $$: true
    }
  }
};