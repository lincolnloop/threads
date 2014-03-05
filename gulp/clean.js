'use strict';
var gulp = require('gulp');
var clean = require('gulp-clean');

gulp.task('clean', function() {
  var production = (process.env.NODE_ENV === 'production');

  // If this is a production build, clean the dist folder. Otherwise, clean the
  // build folder.
  var sources = production ? ['dist/*'] : ['build/*'];

  return gulp.src(sources, {read: false})
    .pipe(clean());
});
