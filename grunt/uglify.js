'use strict';

module.exports = {
  production: {
    files: {
      'dist/<%= pkg.name %>.min.js': ['.tmp/<%= pkg.name %>.js']
    }
  }
};
