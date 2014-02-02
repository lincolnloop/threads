"use strict";

module.exports = {
  dev: {
    src: ['src/scripts/app.js'],
    dest: 'build/<%= pkg.name %>.js',
    options: {
      debug: true
    }
  },
  production: {
    src: '<%= browserify.dev.src %>',
    dest: '.tmp/<%= pkg.name %>.js'
  }
};