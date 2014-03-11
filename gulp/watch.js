'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var livereload = require('gulp-livereload');

gulp.task('watch', function() {
  var reloadServer = livereload();

  var js = gulp.watch('client/**/{*.js,*.jsx}', ['app', 'tests']);
  js.on('change', function(event) {
    reloadServer.changed(event.path);
  });

  var server = gulp.watch('server/**/*.js', ['serve']);
  server.on('change', function(event) {
    reloadServer.changed(event.path);
  });

  var sass = gulp.watch('client/sass/**/*.scss', ['sass']);
  sass.on('change', function(event) {
    reloadServer.changed(event.path);
  });

  gutil.log(gutil.colors.bgGreen('Watching for changes...'));
});
