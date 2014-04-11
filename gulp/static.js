'use strict';
var gulp = require('gulp');

gulp.task('static', function(){
  var production = (process.env.NODE_ENV === 'production');

  var sources = ['client/static', 'node_modules/font-awesome/fonts'];

  // Copy static files to the build directory
  return gulp.src(sources)
    .pipe(gulp.dest(production ? 'dist/' : 'build/'));
});
