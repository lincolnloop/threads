"use strict";

module.exports = {
  js: {
    files: ['package.json', '<%= jshint.src %>', 'src/**/*.jsx'],
    tasks: ['browserify:dev', 'jshint']
  },
  html: {
    files: ['src/**/*.html.tpl'],
    tasks: ['template:dev']
  },
  scss: {
    files: ['src/sass/**/*.scss'],
    tasks: ['sass:dev']
  }
};