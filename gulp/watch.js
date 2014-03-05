'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var livereload = require('gulp-livereload');

gulp.task('watch', function() {
  var server = livereload();

  gulp.watch('client/**/{*.js,*.jsx}', function(event) {
    gulp.start(['app', 'tests'], function() {
      server.changed(event.path);
    });
  });

  gulp.watch('server/**/*.js', function(event) {
    gulp.start('serve', function() {
      server.changed(event.path);
    });
  });

  gulp.watch('client/sass/**/*.scss', function(event) {
    gulp.start('sass', function() {
      server.changed(event.path);
    });
  });

  gutil.log(gutil.colors.bgGreen('Watching for changes...'));
});
