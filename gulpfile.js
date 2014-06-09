'use strict';
var gulp = require('gulp');

require('./gulp/app');
require('./gulp/clean');
require('./gulp/static');
require('./gulp/help');
require('./gulp/jshint');
require('./gulp/sass');
require('./gulp/html');
require('./gulp/serve');
require('./gulp/tests');
require('./gulp/vendor');
require('./gulp/watch');

<<<<<<< HEAD
=======
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
    'port': 8000,
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
>>>>>>> d35d69f... minor lint fixes
gulp.task('build', [
  'jshint',
  'clean',
  'app',
  'tests',
  'vendor',
  'sass',
  'static',
  'html'
]);

gulp.task('default', ['build'], function() {
  return gulp.start('serve', 'watch');
});
