'use strict';

module.exports = {
  options: {
    debug: true,
    transform: ['reactify'],
    extensions: ['.jsx'],
  },
  dev: {
    options: {
      alias: ['react:']  // Make React available externally for dev tools
    },
    src: ['client/index.js',],
    dest: 'build/<%= pkg.name %>.js'
  },
  test: {
    src: ['client/tests/index.js',],
    dest: 'build/tests.js'
  },
  production: {
    options: {
      debug: false
    },
    src: ['client/index.js'],
    dest: '.tmp/<%= pkg.name %>.js'
  }
};
