'use strict';
var gulp = require('gulp');
var rename = require('gulp-rename');
var handlebars = require('gulp-compile-handlebars');
var pkg = require('../package.json');

gulp.task('html', function () {
  var production = (process.env.NODE_ENV === 'production');
  var data = {
    'css': pkg.name + (production ? '.min' : '') + '.css',
    'app': pkg.name + (production ? '.min' : '') + '.js',
    'vendor': 'vendor' + (production ? '.min' : '') + '.js'
  };

  return gulp.src('server/views/index.hbs')

    // parse through handlebars templates
    .pipe(handlebars(data))

    // Save it as index.html
    .pipe(rename('index.html'))

    // Save as index.html to the dist directory if production, or to the build directory
    .pipe(gulp.dest(production ? 'dist/' : 'build/'));
});
