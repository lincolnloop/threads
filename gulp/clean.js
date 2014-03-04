'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var clean = require('gulp-clean');

gulp.task('clean', function() {
  // If this is a production build, clean the dist folder. Otherwise, clean the
  // build folder.
  var sources = gutil.env.production ? ['dist/*'] : ['build/*'];

  return gulp.src(sources, {read: false})
    .pipe(clean());
});
