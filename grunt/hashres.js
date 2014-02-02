"use strict";

module.exports = {
  options: {
    fileNameFormat: '${name}.${hash}.${ext}'
  },
  production: {
    src: ['dist/ginger.css', 'dist/ginger.min.js'],
    dest: 'dist/index.html'
  }
}