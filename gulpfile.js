'use strict';
var gulp = require('gulp');

require('./gulp/app');
require('./gulp/clean');
require('./gulp/fonts');
require('./gulp/jshint');
require('./gulp/sass');
require('./gulp/template');
require('./gulp/tests');

gulp.task('default', [
  'jshint',
  'clean',
  'app',
  'tests',
  'sass',
  'template',
  'fonts'
]);
