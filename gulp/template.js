'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var pkg = require('../package.json');
var rename = require('gulp-rename');
var template = require('gulp-template');

gulp.task('template', function () {
  return gulp.src('server/templates/index.html.tpl')

    // Render the lodash template, providing the correct location for the
    // JS and CSS assets.
    .pipe(template({
      js: '/' + pkg.name + (gutil.env.production ? '.min' : '') + '.js',
      css: '/' + pkg.name + (gutil.env.production ? '.min' : '') + '.css',
    }))

    // Drop the .tpl extension
    .pipe(rename('index.html'))

    // Save to the dist directory if production, or to the build directory
    .pipe(gulp.dest(gutil.env.production ? 'dist/' : 'build/'));
});
