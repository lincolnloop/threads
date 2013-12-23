module.exports = function(grunt) {
    var pushStateHook = function (url) {
      // re-route paths back to index so Backbone can route
      var path = require('path'),
          request = require('request');
      return function (req, res, next) {
        var ext = path.extname(req.url);
        if ((ext === "" || ext === ".html") && req.url !== "/") {
          req.pipe(request('http://' + req.headers.host)).pipe(res);
        } else {
          next();
        }
      };
    };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['public/build/*.js'],
        dest: 'public/build/ginger.js'
      }
    },
    connect: {
      server: {
        options: {
          base: 'public',
          port: 9001,
          middleware: function (connect, options) {
            return [
                connect.static(options.base),
                pushStateHook(),
            ];
          }
        }
      }
    },
    browserify: {
      ginger: {
        src: ['public/scripts/main.js'],
        dest: 'public/build/module.js',
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
        tasks: ['clean', 'browserify', 'concat', 'jshint']
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-execute');

  grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'browserify']);
  grunt.registerTask('serve', ['connect:server:keepalive']);

};
