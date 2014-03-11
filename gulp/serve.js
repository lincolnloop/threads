'use strict';
var app = require('../server/app');
var gulp = require('gulp');
var gutil = require('gulp-util');

gulp.task('serve', function() {
  var port = process.env.PORT || 8080;
  gutil.log(gutil.colors.bgGreen('Express listening on port ' + port + '...'));
  app.start(port);
});
