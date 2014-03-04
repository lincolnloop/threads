'use strict';
var browserify = require('gulp-browserify');
var gulp = require('gulp');
var gutil = require('gulp-util');
var pkg = require('../package.json');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('app', function() {
  return gulp.src('client/index.js', {read: false})

    // Browserify it
    .pipe(browserify({
      debug: !gutil.env.production,  // If not production, add source maps
      transform: ['reactify'],
      extensions: ['.jsx']
    }))

    .on('prebundle', function(bundler) {
      // Make React available externally for dev tools
      bundler.require('react');
    })

    // If this is a production build, minify it
    .pipe(gutil.env.production ? uglify() : gutil.noop())

    // Give the destination file a name, adding '.min' if this is production
    .pipe(rename(pkg.name + (gutil.env.production ? '.min' : '') + '.js'))

    // Save to the dist directory if production, or to the build directory
    .pipe(gulp.dest(gutil.env.production ? 'dist/' : 'build/'));

});
