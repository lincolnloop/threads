'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');

gulp.task('static', function(){
  var production = (process.env.NODE_ENV === 'production');

  // Copy static files to the build directory
  gulp.src('client/static/**/*')
    .pipe(gulp.dest(production ? 'dist/static/' : 'build/static/'));

  // Copy static files to the build directory
  return gulp.src('node_modules/font-awesome/fonts/**/*')
    .pipe(gulp.dest(production ? 'dist/fonts/' : 'build/fonts/'));
});
