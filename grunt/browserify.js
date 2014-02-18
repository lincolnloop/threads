"use strict";

module.exports = {
  options: {
    debug: true,
    transform: ['reactify'],
    extensions: ['.jsx'],
  },
  dev: {
    src: ['src/app.js'],
    dest: 'build/<%= pkg.name %>.js'
  },
  production: {
    options: {
      debug: false
    },
    src: '<%= browserify.dev.src %>',
    dest: '.tmp/<%= pkg.name %>.js'
  }
};
