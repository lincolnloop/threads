"use strict";

module.exports = {
  options: {
    fileNameFormat: '${name}.${hash}.${ext}'
  },
  production: {
    src: ['dist/threads.css', 'dist/threads.min.js'],
    dest: 'dist/index.html'
  }
}