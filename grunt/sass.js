"use strict";

module.exports = {
  options: {
    includePaths: ['node_modules/foundation/scss']
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