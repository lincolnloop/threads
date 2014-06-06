'use strict';
var browserify = require('browserify');
var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var livereload = require('gulp-livereload');
var source = require('vinyl-source-stream');
var handlebars = require('gulp-compile-handlebars');
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
// JavaScript dev tasks
// --------------------------
gulp.task('jshint', function() {
  return gulp.src(sources.jshint)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
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
// Deployment tasks
// --------------------------
gulp.task('dist', function() {
  var timestamp = +new Date;
  gutil.log(timestamp);
  var dest = 'dist/';
  var filenames = {
    'js': 'threads.min.js',
    'sass': 'threads.min.scss'
  }

  // javascripts
  var bundler = browserify(sources.js);
  return bundle(bundler, {
    'uglify': false, // TODO: uglify is broken
    'name': filenames.js,
    'dest': dest
  });

  // sass

  // generate html
  gulp.src('server/views/index.hbs')
    // parse through handlebars templates
    .pipe(handlebars(data))
    // save as index.html to the dist directory
    .pipe(source('index.html'))
    .pipe(gulp.dest(dest));
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
