'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var neat = require('node-neat').includePaths;
var pkg = require('../package.json');
var rename = require('gulp-rename');
var sass = require('gulp-sass');

gulp.task('sass', function () {
  return gulp.src('client/sass/app.scss')

    // Precompile with libsass, including the neat library
    .pipe(sass({
      'includePaths': neat,
      'outputStyle': gutil.env.production ? 'compressed' : 'expanded'
    }))

    // Give the destination file a name, adding '.min' if this is production
    .pipe(rename(pkg.name + (gutil.env.production ? '.min' : '') + '.css'))

    // Save to the dist directory if production, or to the build directory
    .pipe(gulp.dest(gutil.env.production ? 'dist/' : 'build/'));
});
