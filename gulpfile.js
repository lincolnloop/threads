'use strict';
var browserify = require('browserify');
var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var livereload = require('gulp-livereload');
var watchify = require('watchify');

var bundle = require('./gulp/bundle');

// live reload server
var reloadServer = livereload();

// File sources
var sources = {
  'js': './client/index.js',
  'jshint': [
    'gulpfile.js',
    'gulp/**/*.js',
    'client/index.js',
    'client/app/**/*.js'
  ]
};

// --------------------------
// Custom tasks
// --------------------------
require('./gulp/clean');
require('./gulp/static');
require('./gulp/help');
require('./gulp/sass');
require('./gulp/html');
require('./gulp/serve');
require('./gulp/tests');
require('./gulp/watch');

// --------------------------
// JavaScript tasks
// --------------------------
gulp.task('jshint', function() {
  return gulp.src(sources.jshint)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

// publish to production
gulp.task('dist:js', function() {
  var bundler = browserify(sources.js);
  return bundle(bundler, {
    'uglify': false,
    'name': 'threads.min.js',
    'dest': 'dist/'
  });
});

// watch JS for changes and livereload
gulp.task('watch:js', function() {
  var bundler = watchify(sources.js);
  var opts = {
    'debug': true,
    'name': 'threads.js',
    'dest': 'build/'
  };

  bundler.on('update', function(evt) {
    gutil.log(gutil.colors.bgGreen('Reloading scripts...'));
    gulp.run('jshint', 'tests');
    reloadServer.changed(evt[0]);
    return bundle(bundler, opts);
  });

  gulp.watch(sources.jshint, ['jshint']);

  return bundle(bundler, opts);
});


// --------------------------
// Composite tasks
// --------------------------
// build task
gulp.task('build', [
  'jshint',
  'clean',
  'watch:js',
  'tests',
  'sass',
  'static',
  'html'
]);

gulp.task('default', ['build'], function() {
  return gulp.start('serve', 'watch');
});
