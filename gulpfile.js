'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var livereload = require('gulp-livereload');
var watchify = require('watchify');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var connect = require('gulp-connect');
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
require('./gulp/static');
require('./gulp/help');
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
gulp.task('watch', function() {

  // create live reload server
  var server = connect.server({
    'root': 'build',
    'port': 8000,
    'livereload': true
  });
  var dest = 'build/'

  //
  // js bundle
  //
  var jsBundle = watchify(sources.browserify);
  var jsOpts = {
    'debug': true,
    'name': 'threads.js',
    'dest': dest
  };
  // watch js
  jsBundle.on('update', function(evt) {
    gutil.log(gutil.colors.bgGreen('Reloading scripts...'));
    connect.reload();
    return bundle(jsBundle, jsOpts);
  });
  // linting
  gulp.watch(sources.jshint, ['jshint']);
  // build js once
  bundle(jsBundle, jsOpts);
  // watch builded file
  gulp.watch('build/threads.js', function() {
    gutil.log(gutil.colors.bgGreen('Reloading JS...'));
    gulp.src('build/threads.js').pipe(connect.reload());
  });

  //
  // watch css
  //
  gulp.watch(sources.css, function(event) {
    //
    // build sass
    //
    gulp.src(sources.sass)
      .pipe(sass({
        'includePaths': neat,
        'outputStyle': 'expanded',
        'sourceComments': 'map'
      }))
      // error logging
      .on('error', gutil.log)
      // give it a file and save
      .pipe(rename('threads.css'))
      .pipe(gulp.dest(dest));
  });
  // watch builded file
  gulp.watch('build/threads.css', function() {
    gutil.log(gutil.colors.bgGreen('Reloading sass...'));
    gulp.src('build/threads.css').pipe(connect.reload());
  });

  //
  // index.html
  //
  gulp.src(sources.html)
    // parse through handlebars templates
    .pipe(handlebars({
      'css': 'threads.css',
      'js': 'threads.js'
    }))
    // save as index.html to the dist directory
    .pipe(rename('index.html'))
    .pipe(gulp.dest(dest));

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
    'css': 'threads.'+ timestamp +'.css'
  };

  // clean dist dir
  gulp.src('dist', {read: false})
    .pipe(clean());

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
    .pipe(rename(filenames.css))
    .pipe(gulp.dest(dest));

  //
  // index.html
  //
  gulp.src(sources.html)
    // parse through handlebars templates
    .pipe(handlebars(filenames))
    // save as index.html to the dist directory
    .pipe(rename('index.html'))
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

gulp.task('default', ['watch']);
