'use strict';

module.exports = {
  options: {livereload: true},
  js: {
    files: ['package.json', '<%= jshint.src %>', 'client/**/*.jsx'],
    tasks: ['browserify:dev', 'browserify:test', 'jshint']
  },
  html: {
    files: ['src/**/*.html.tpl'],
    tasks: ['template:dev']
  },
  scss: {
    files: ['client/sass/**/*.scss'],
    tasks: ['sass:dev']
  }
};
