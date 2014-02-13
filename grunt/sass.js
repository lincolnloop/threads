"use strict";

// bourbon is required by neat
// and already includes it in it's includePaths
// var bourbon = require('node-bourbon').includePaths;
var neat = require('node-neat').includePaths;

module.exports = {
  options: {
    includePaths: neat
  },
  dev: {
    files: {
      'build/<%= pkg.name %>.css': 'src/sass/app.scss',
    }
  },
  production: {
    files: {
      'dist/<%= pkg.name %>.css': 'src/sass/app.scss',
    },
    options: '<%= sass.dev.options %>'
  }
}
