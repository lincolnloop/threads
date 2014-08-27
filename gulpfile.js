'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var watchify = require('watchify');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
// static server
var connect = require('gulp-connect');
var pushState = require('grunt-connect-pushstate/lib/utils').pushState;
var cookies = require('cookies');
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
// local config 
var config = require('./config/' + (process.env.NODE_ENV || 'development'));

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
  'static': 'client/assets/**/*',
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
    'static': 'build/assets/',
    'fonts': 'build/assets/fonts'
  };

  // create live reload server
  connect.server({
    'root': dest.root,
    'port': process.env.PORT || 8000,
    'livereload': true,
    middleware: function(connect) {
      return [
        // setup the config settings in a cookie
        cookies.express(),
        function (req, res, next) {
          res.cookies.set('config', JSON.stringify(config), { httpOnly: false });
          next();
        },
        // enable pushState support
        // every url will load the root (index.html)
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
gulp.task('clean', function() {
  // clean dist dir
  return gulp.src('dist', {'read': false, 'force': true})
    .pipe(clean());
});
gulp.task('dist', ['clean'], function() {
  // timestamp to version files
  var timestamp = +new Date();
  // destination folder
  var dest = {
    'root': 'dist/',
    'static': 'dist/assets/',
    'fonts': 'dist/assets/fonts'
  };
  // versioned filenames
  var filenames = {
    'js': 'threads.'+ timestamp +'.js',
    'css': 'threads.'+ timestamp +'.css'
  };
  //
  // javascripts
  //
  var bundler = browserify(sources.browserify);
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
