'use strict';
var gulp = require('gulp');

require('./gulp/app');
require('./gulp/clean');
require('./gulp/fonts');
require('./gulp/help');
require('./gulp/jshint');
require('./gulp/sass');
require('./gulp/html');
require('./gulp/serve');
require('./gulp/tests');
require('./gulp/vendor');
require('./gulp/watch');

gulp.task('build', [
  'jshint',
  'clean',
  'app',
  'tests',
  'vendor',
  'sass',
  'fonts',
  'html'
]);

gulp.task('default', ['build'], function() {
  return gulp.start('serve', 'watch');
});
