"use strict";

var ENV = process.env.NODE_ENV || 'development',
    config = require('./config/' + ENV),
    Cookies = require('cookies'),
    pushState = require('grunt-connect-pushstate/lib/utils').pushState;

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          base: 'build',
          port: 8000,
          middleware: function (connect, options) {
            return [
                Cookies.express(),
                function (req, res, next) {
                  res.cookies.set('config', JSON.stringify(config), { httpOnly: false });
                  next();
                },
                pushState(),
                connect.static(options.base)
            ];
          }
        }
      }
    },
    sass: {
      options: {
          includePaths: ['node_modules/foundation/scss']
      },
      dev: {
        files: {
          'build/<%= pkg.name %>.css': 'src/sass/app.scss',
        }
      },
      production: {
        files: {
          'dist/<%= pkg.name %>.css': 'src/sass/app.scss',
        },
        options: '<%= sass.dev.options %>'
      }
    },
    browserify: {
      dev: {
        src: ['src/scripts/app.js'],
        dest: 'build/<%= pkg.name %>.js',
        options: {
          debug: true
        }
      },
      production: {
        src: '<%= browserify.dev.src %>',
        dest: '.tmp/<%= pkg.name %>.js'
      }
    },
    clean: {
      dev: ['build/*'],
      production: ['dist/*', '.tmp/*'],
    },
    template: {
      dev: {
        files: {
          'build/index.html': ['src/index.html.tpl']
        },
        options: {
          data: {
            js: '/<%= pkg.name %>.js',
            css: '/<%= pkg.name %>.css'
          }
        }
      },
      production: {
        files: {
          'dist/index.html': ['src/index.html.tpl']
        },
        options: {
          data: {
            js: '/<%= pkg.name %>.min.js',
            css: '/<%= pkg.name %>.css'
          }
        }
      }
    },
    uglify: {
      production: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['.tmp/<%= pkg.name %>.js']
        }
      }
    },
    hashres: {
      options: {
        fileNameFormat: '${name}.${hash}.${ext}'
      },
      production: {
        src: ['dist/ginger.css', 'dist/ginger.min.js'],
        dest: 'dist/index.html'
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      src: ['Gruntfile.js', 'src/scripts/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globalstrict: true,
        globals: {
          jQuery: true,
          console: true,
          module: true,
          require: true,
          window: true,
          localStorage: true,
          document: true,
          process: true
        }
      }
    },
    watch: {
      js: {
        files: ['package.json', '<%= jshint.src %>', 'src/scripts/**/*.jsx'],
        tasks: ['browserify:dev', 'jshint']
      },
      html: {
        files: ['src/**/*.html.tpl'],
        tasks: ['template:dev']
      },
      scss: {
        files: ['src/sass/**/*.scss'],
        tasks: ['sass:dev']
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-template');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-hashres');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-execute');

  grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'browserify']);
  grunt.registerTask('build', ['clean:dev', 'browserify:dev', 'sass:dev', 'template:dev']);
  grunt.registerTask('dist', ['clean:production', 'browserify:production', 'uglify', 'sass:production', 'template:production', 'hashres:production']);
  grunt.registerTask('serve', ['connect:server:keepalive']);

};
