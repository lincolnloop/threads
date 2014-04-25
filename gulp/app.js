'use strict';
var _ = require('underscore');
var browserify = require('gulp-browserify');
var gulp = require('gulp');
var gutil = require('gulp-util');
var libs = require('./vendor').libs;
var pkg = require('../package.json');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('app', function() {
  var production = (process.env.NODE_ENV === 'production');

  return gulp.src('client/index.js', {read: false})

    // Browserify it
    .pipe(browserify({
      debug: !production,  // If not production, add source maps
      transform: ['reactify'],
      extensions: ['.jsx']
    }))
    .on('error', function(error) {
        gutil.log(error);
        process.stdout.write('\x07');
      })
    .on('prebundle', function(bundle) {
      // The following requirements are loaded from the vendor bundle
      _.each(libs, function(lib) {
        bundle.external(lib);
      });
    })

    // If this is a production build, minify it
    .pipe(production ? uglify() : gutil.noop())

    // Give the destination file a name, adding '.min' if this is production
    .pipe(rename(pkg.name + (production ? '.min' : '') + '.js'))

    // Save to the dist directory if production, or to the build directory
    .pipe(gulp.dest(production ? 'dist/' : 'build/'));

});
