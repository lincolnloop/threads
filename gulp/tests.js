'use strict';
var _ = require('underscore');
var browserify = require('gulp-browserify');
var gulp = require('gulp');
var libs = require('./vendor').libs;
var rename = require('gulp-rename');

gulp.task('tests', function() {
  return gulp.src('client/tests/index.js', {read: false})

    // Browserify it
    .pipe(browserify({
      debug: true,
      transform: ['reactify'],
      extensions: ['.jsx']
    }))

    .on('prebundle', function(bundle) {
      // The following requirements are loaded from the vendor bundle
      _.each(libs, function(lib) {
        bundle.external(lib);
      });
    })

    // Rename the destination file
    .pipe(rename('tests.js'))

    // Save to the dist directory if production, or to the build directory
    .pipe(gulp.dest('build/'));

});
