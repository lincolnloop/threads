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
  'in-viewport',
  'jquery',
  'loglevel',
  'MD5',
  'react',
  'rsvp',
  'underscore',
];

gulp.task('vendor', function() {
  var production = (process.env.NODE_ENV === 'production');

  // Use React as the entry point, since it doesn't work without one
  return gulp.src('./node_modules/react/react.js', {read: false})

    // Browserify it
    .pipe(browserify({
      debug: false,  // Don't provide source maps for vendor libs
    }))

    .on('prebundle', function(bundle) {
      // Require vendor libraries and make them available outside the bundle.
      // Omit React because we need to use the version with addons.
      _.each(_.without(libs, 'react'), function(lib) {
        bundle.require(lib);
      });

      // Export React with Addons as simply "react"
      bundle.require('react/addons', {expose: 'react'});
    })

    // If this is a production build, minify it
    .pipe(production ? uglify() : gutil.noop())

    // Give the destination file a name, adding '.min' if this is production
    .pipe(rename('vendor' + (production ? '.min' : '') + '.js'))

    // Save to the dist directory if production, or to the build directory
    .pipe(gulp.dest(production ? 'dist/' : 'build/'));

});

exports.libs = libs;
