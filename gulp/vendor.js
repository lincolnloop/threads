'use strict';
var _ = require('underscore');
var browserify = require('gulp-browserify');
var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var libs = [
  'backbone',
  'clientconfig',
  'crossing',
  'fastclick',
  'jquery',
  'loglevel',
  'MD5',
  'react',
  'react/lib/ReactCSSTransitionGroup',
  'react/lib/cx',
  'underscore',
];

gulp.task('vendor', function() {
  var production = (process.env.NODE_ENV === 'production');

  // A dummy entry point for browserify
  return gulp.src('./gulp/noop.js', {read: false})

    // Browserify it
    .pipe(browserify({
      debug: false,  // Don't provide source maps for vendor libs
    }))

    .on('prebundle', function(bundle) {
      // Require vendor libraries and make them available outside the bundle.
      _.each(libs, function(lib) {
        bundle.require(lib);
      });
    })

    // If this is a production build, minify it
    .pipe(production ? uglify() : gutil.noop())

    // Give the destination file a name, adding '.min' if this is production
    .pipe(rename('vendor' + (production ? '.min' : '') + '.js'))

    // Save to the dist directory if production, or to the build directory
    .pipe(gulp.dest(production ? 'dist/' : 'build/'));

});

exports.libs = libs;
