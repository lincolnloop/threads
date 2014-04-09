'use strict';
var gulp = require('gulp');
var pkg = require('../package.json');

gulp.task('sass', function () {
  var production = (process.env.NODE_ENV === 'production');

  return gulp.src('server/views/index.hbs')

    // parse through handlebars templates
    .pipe(sass({
      'includePaths': neat,
      'outputStyle': production ? 'compressed' : 'expanded'
    }))

    // Save it as index.html
    .pipe(rename('index.html'))

    // Save as index.html to the dist directory if production, or to the build directory
    .pipe(gulp.dest(production ? 'dist/' : 'build/'));
});
