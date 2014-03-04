'use strict';
var gulp = require('gulp');

gulp.task('fonts', function(){
  // Copy from font awesome's npm package to the build directory
  return gulp.src('node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest('build/fonts'));
});
