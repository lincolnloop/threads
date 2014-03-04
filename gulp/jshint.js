'use strict';
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

gulp.task('jshint', function() {
  return gulp.src(['gulpfile.js', 'gulp/**/*.js', 'client/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});
