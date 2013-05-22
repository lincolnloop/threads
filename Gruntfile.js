module.exports = function(grunt) {
    var pushStateHook = function (url) {
      // re-route paths back to index so Backbone can route
      var path = require('path'),
          request = require('request');
      return function (req, res, next) {
        var ext = path.extname(req.url);
        if ((ext == "" || ext === ".html") && req.url != "/") {
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
        src: ['webapp/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    connect: {
      server: {
        options: {
          base: 'public',
          middleware: function (connect, options) {
            return [
                connect.static(options.base),
                pushStateHook(),
            ];
          }
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
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
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'qunit']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);
  grunt.registerTask('serve', ['connect:server:keepalive']);

};
