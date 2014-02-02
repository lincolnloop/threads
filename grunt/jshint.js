"use strict";

module.exports = {
  src: ['Gruntfile.js', 'src/scripts/**/*.js'],
  options: {
    // options here to override JSHint defaults
    globalstrict: true,
    globals: {
      jQuery: true,
      console: true,
      module: true,
      require: true,
      window: true,
      localStorage: true,
      document: true,
      process: true
    }
  }
};