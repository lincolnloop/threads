'use strict';
var gulp = require('gulp');

require('./gulp/build');
require('./gulp/build-tests');
require('./gulp/clean');
require('./gulp/jshint');
require('./gulp/sass');
require('./gulp/template');

gulp.task('default', [
  'jshint',
  'clean',
  'build',
  'build-tests',
  'sass',
  'template'
]);
