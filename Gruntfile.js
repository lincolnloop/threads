'use strict';

module.exports = function(grunt) {
  // grunt task configuration files are stored at "./grunt/*.js"
  require('load-grunt-config')(grunt, {
    config: {
      pkg: grunt.file.readJSON('package.json'),
    }
  });

  grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('default', ['build', 'connect:server', 'watch']);
  grunt.registerTask('build', ['jshint', 'clean:dev', 'browserify:dev', 'sass:dev', 'template:dev']);
  grunt.registerTask('dist', ['clean:production', 'browserify:production', 'uglify', 'sass:production', 'template:production', 'hashres:production']);
  grunt.registerTask('serve', ['connect:server:keepalive']);

};
