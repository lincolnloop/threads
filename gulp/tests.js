'use strict';
var browserify = require('gulp-browserify');
var gulp = require('gulp');
var rename = require('gulp-rename');

gulp.task('tests', function() {
  return gulp.src('client/tests/index.js', {read: false})

    // Browserify it
    .pipe(browserify({
      debug: true,
      transform: ['reactify'],
      extensions: ['.jsx']
    }))

    .on('prebundle', function(bundler) {
      // Make React available externally for dev tools
      bundler.require('react');
    })

    // Rename the destination file
    .pipe(rename('tests.js'))

    // Save to the dist directory if production, or to the build directory
    .pipe(gulp.dest('build/'));

});
