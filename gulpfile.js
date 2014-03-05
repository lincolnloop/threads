'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var livereload = require('gulp-livereload');

require('./gulp/app');
require('./gulp/clean');
require('./gulp/fonts');
require('./gulp/jshint');
require('./gulp/sass');
require('./gulp/serve');
require('./gulp/tests');

gulp.task('build', [
  'jshint',
  'clean',
  'app',
  'tests',
  'sass',
  'fonts'
]);

gulp.task('default', ['build', 'serve'], function() {
  var server = livereload();

  gutil.log(gutil.colors.bgGreen('Watching for changes...'));

  gulp.watch('{client,server}/**/{*.js,*.jsx}', function(event) {
    gulp.start('build', function() {
      server.changed(event.path);
    });
  });
});
