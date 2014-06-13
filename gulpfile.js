'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var watchify = require('watchify');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
// static server
var connect = require('gulp-connect');
var pushState = require('grunt-connect-pushstate/lib/utils').pushState;
// javascript
var browserify = require('browserify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var bundlejs = require('./gulp/bundlejs');
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
  'html': 'templates/index.hbs',
  'static': 'client/static/**/*',
  'fonts': 'node_modules/font-awesome/fonts/**/*'
};

// --------------------------
// Custom tasks
// --------------------------
require('./gulp/static');
require('./gulp/help');
require('./gulp/tests');

// --------------------------
// JSHint
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
  // destination directories
  var dest = {
    'root': 'build/',
    'js': 'build/threads.js',
    'css': 'build/threads.css',
    'static': 'build/static/',
    'fonts': 'build/static/fonts'
  };

  // create live reload server
  connect.server({
    'root': dest.root,
    'port': process.env.PORT || 8000,
    'livereload': true,
    middleware: function(connect) {
      return [
        pushState(),
        connect.static(dest.root)
      ];
    }
  });

  // --------------------------
  // js bundle
  // --------------------------
  var jsBundle = watchify(sources.browserify);
  var jsOpts = {
    'debug': true,
    'name': 'threads.js',
    'dest': dest.root
  };
  // watch js
  jsBundle.on('update', function() {
    gutil.log(gutil.colors.bgGreen('Reloading scripts...'));
    connect.reload();
    return bundlejs(jsBundle, jsOpts);
  });
  // linting
  gulp.watch(sources.jshint, ['jshint']);
  // build js once
  bundlejs(jsBundle, jsOpts);
  // watch builded file
  gulp.watch(dest.js, function() {
    gulp.src(dest.js).pipe(connect.reload());
  });

  // --------------------------
  // watch css
  // --------------------------

  // initial build
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
    .pipe(gulp.dest(dest.root));

  // watch the build file 
  // and reload the server
  gulp.watch(dest.css, function() {
    gulp.src(dest.css).pipe(connect.reload());
  });

  // watch the sources and rebuild
  gulp.watch(sources.css, function() {
    gutil.log(gutil.colors.bgGreen('Rebuilding sass...'));
    return gulp.src(sources.sass)
      .pipe(sass({
        'includePaths': neat,
        'outputStyle': 'expanded',
        'sourceComments': 'map'
      }))
      // error logging
      .on('error', gutil.log)
      // give it a file and save
      .pipe(rename('threads.css'))
      .pipe(gulp.dest(dest.root));
  });

  // --------------------------
  // Copy static files & fonts
  // --------------------------
  // copy all files under 
  // client/static
  gulp.src('client/static/**/*')
    .pipe(gulp.dest(dest.static));
  // font awesome
  gulp.src(sources.fonts)
    .pipe(gulp.dest(dest.fonts));

  // --------------------------
  // index.html
  // --------------------------
  gulp.src(sources.html)
    // parse through handlebars templates
    .pipe(handlebars({
      'css': 'threads.css',
      'js': 'threads.js'
    }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(dest.root));

  gutil.log(gutil.colors.bgGreen('Watching for changes...'));
});

// --------------------------
// Deployment
// --------------------------
gulp.task('dist', function() {
  // timestamp to version files
  var timestamp = +new Date();
  // destination folder
  var dest = {
    'root': 'dist/',
    'static': 'dist/static/',
    'fonts': 'dist/static/fonts'
  };
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
  bundlejs(bundler, {
    'uglify': false, // TODO: uglify is broken
    'name': filenames.js,
    'dest': dest.root
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
    .pipe(gulp.dest(dest.root));

  //
  // Copy Static files css
  //
  // all files under client/static
  gulp.src('client/static/**/*')
    .pipe(gulp.dest(dest.static));
  // font awesome
  gulp.src(sources.fonts)
    .pipe(gulp.dest(dest.fonts));

  //
  // index.html
  //
  gulp.src(sources.html)
    // parse through handlebars templates
    .pipe(handlebars(filenames))
    // save as index.html to the dist directory
    .pipe(rename('index.html'))
    .pipe(gulp.dest(dest.root));
});

// --------------------------
// Composite tasks
// --------------------------
// build task
gulp.task('build', [
  'jshint',
  'tests',
  'dist'
]);

gulp.task('default', ['watch', 'jshint']);
