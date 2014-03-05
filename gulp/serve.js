'use strict';
var app = require('../server/app');
var gulp = require('gulp');

gulp.task('serve', function() {
  app.listen(process.env.PORT || 8080);
});
