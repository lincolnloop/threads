'use strict';

module.exports = {
  options: {livereload: true},
  js: {
    files: ['package.json', '<%= jshint.src %>', 'client/**/*.jsx'],
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
