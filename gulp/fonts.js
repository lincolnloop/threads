'use strict';
var gulp = require('gulp');

gulp.task('fonts', function(){
  var production = (process.env.NODE_ENV === 'production');

  // Copy from font awesome's npm package to the build directory
  return gulp.src('node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest(production ? 'dist/fonts' : 'build/fonts'));
});
