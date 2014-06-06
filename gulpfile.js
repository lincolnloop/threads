'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var livereload = require('gulp-livereload');
var watchify = require('watchify');
var rename = require('gulp-rename');
// javascript
var browserify = require('browserify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var bundle = require('./gulp/bundle');
// sass
var neat = require('node-neat').includePaths;
var sass = require('gulp-sass');
// html
var handlebars = require('gulp-compile-handlebars');

// File sources
var sources = {
  'browserify': './client/index.js',
  'jshint': [
    'gulpfile.js',
    'gulp/**/*.js',
    'client/index.js',
    'client/app/**/*.js'
  ],
  'css': [
    'client/sass/**/*.css',
    'client/sass/**/*.scss'
  ],
  'sass': 'client/sass/app.scss',
  'html': 'server/views/index.hbs'
};

// --------------------------
// Custom tasks
// --------------------------
require('./gulp/clean');
require('./gulp/static');
require('./gulp/help');
require('./gulp/serve');
require('./gulp/tests');

// --------------------------
// JavaScript dev tasks
// --------------------------
gulp.task('jshint', function() {
  return gulp.src(sources.jshint)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});


// --------------------------
// Development
// --------------------------
gulp.task('dev', function() {

  // create live reload server
  var reloadServer = livereload();

  //
  // js bundle
  //
  var jsbundler = watchify(sources.browserify);
  var jsopts = {
    'debug': true,
    'name': 'threads.js',
    'dest': 'build/'
  };
  // watch js
  jsbundler.on('update', function(evt) {
    gutil.log(gutil.colors.bgGreen('Reloading scripts...'));
    reloadServer.changed(evt[0]);
    return bundle(jsbundler, jsopts);
  });
  // jshint
  gulp.watch(sources.jshint, ['jshint']);

  //
  // css bundle
  //
  var sass = gulp.watch(sources.css, ['sass']);
  sass.on('change', function(event) {
    gutil.log(gutil.colors.bgGreen('Reloading sass...'));
    reloadServer.changed(event.path);
  });

  // run once
  // js
  bundle(jsbundler, jsopts);

  gutil.log(gutil.colors.bgGreen('Watching for changes...'));
});

// --------------------------
// Deployment
// --------------------------
gulp.task('dist', function() {
  // timestamp to version files
  var timestamp = +new Date();
  // destination folder
  var dest = 'dist/';
  // versioned filenames
  var filenames = {
    'js': 'threads.'+ timestamp +'.js',
    'sass': 'threads.'+ timestamp +'.scss',
    'html': 'index.html'
  };

  //
  // javascripts
  //
  var bundler = browserify(sources.js);
  bundle(bundler, {
    'uglify': false, // TODO: uglify is broken
    'name': filenames.js,
    'dest': dest
  });

  //
  // sass
  //
  gulp.src(sources.sass)
    .pipe(sass({
      'includePaths': neat,
      'outputStyle': 'compressed'
    }))
    // error logging
    .on('error', gutil.log)
    // give it a file and save
    .pipe(rename(filenames.sass))
    .pipe(gulp.dest(dest));
  //
  // index.html
  //
  gulp.src(sources.html)
    // parse through handlebars templates
    .pipe(handlebars(filenames))
    // save as index.html to the dist directory
    .pipe(rename(filenames.html))
    .pipe(gulp.dest(dest));
});

// --------------------------
// Composite tasks
// --------------------------
// build task
gulp.task('build', [
  'jshint',
  'tests',
  'clean',
  'static'
]);

gulp.task('default', ['build'], function() {
  return gulp.start('serve', 'watch');
});
