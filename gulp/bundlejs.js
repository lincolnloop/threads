'use strict';
var gulp = require('gulp');
var uglify = require('gulp-uglify');

var source = require('vinyl-source-stream');

var bundle = function(bundler, options) {
  var stream = bundler.bundle({'debug': !!options.debug});
  // uglify for production
  if (options.uglify) {
    stream.pipe(uglify());
  }
  // give it a name and save it to a folder
  stream.pipe(source(options.name))
    .pipe(gulp.dest(options.dest));

  return stream;
};

module.exports = bundle;