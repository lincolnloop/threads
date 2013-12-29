var config = require('./config/' + (process.env.NODE_ENV || 'development')),
    Cookies = require('cookies'),
    pushState = require('grunt-connect-pushstate/lib/utils').pushState;
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          base: 'public',
          port: 9001,
          middleware: function (connect, options) {
            return [
                Cookies.express(),
                function (req, res, next) {
                  res.cookies.set('config', JSON.stringify(config), { httpOnly: false, overwrite: true });
                  next();
                },
                pushState(),
                connect.static(options.base)
            ];
          }
        }
      }
    },
    watchify: {
      ginger: {
        src: ['./public/scripts/app.js'],
        dest: 'public/build/ginger.js',
        options: {
          debug: true
        }
      }
    },
    clean: ['public/build/*'],
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      files: ['Gruntfile.js', 'public/scripts/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      js: {
        files: ['package.json', '<%= jshint.files %>', 'public/scripts/**/*.jsx'],
        tasks: ['clean', 'watchify', 'jshint']
      }
    }
  });

  grunt.loadNpmTasks('grunt-watchify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-execute');

  grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'watchify']);
  grunt.registerTask('serve', ['connect:server:keepalive']);

};
