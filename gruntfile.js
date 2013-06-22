'use strict';
var modRewrite = require('connect-modrewrite');
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    watch: {
      options: {
        livereload: true
      },
      coffee: {
        files: ['app/pages/**/*.coffee'],
        tasks: ['coffee:dist']
      },
      coffeeTest: {
        files: ['test/spec/**/*.coffee'],
        tasks: ['coffee:test']
      },
      compass: {
        files: ['app/styles/**/*.{scss,sass}'],
        tasks: ['compass']
      },
      jshint: {
        files: ['gruntfile.js', 'app/pages/**/*.js', 'test/**/*.js'],
        tasks: ['jshint']
      },
      html_src: {
        files: ['gruntfile.js', 'app/pages/**/*.js', 'app/index.html'],
        tasks: ['html_src']
      },
      livereload: {
        files: [
          'app/**/*.html',
          '{.tmp,app}/styles/**/*.css',
          '{.tmp,app}/pages/**/*.js',
          'app/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    connect: {
      options: {
        port: 9000,
        hostname: 'localhost'  // change to 0.0.0.0 for outside access
      },
      pushstate: {
        options: {
          middleware: function (connect) {
            return [
              modRewrite(['!\\.html|/images|\\.ico|\\.js|\\.css|\\swf$ /index.html']),
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'app')
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test')
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            'dist/*',
            '!dist/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        camelcase: false,
        quotmark: false
      },

      all: [
        'gruntfile.js',
        'app/pages/**/*.js',
        'test/**/*.js'
      ]
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },
    coffee: {
      dist: {
        files: [{
          expand: true,
          cwd: 'app/pages',
          src: '**/*.coffee',
          dest: '.tmp/pages',
          ext: '.js'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: 'test/spec',
          src: '**/*.coffee',
          dest: '.tmp/spec',
          ext: '.js'
        }]
      }
    },
    compass: {
      options: {
        sassDir: 'app/styles',
        cssDir: '.tmp/styles',
        imagesDir: 'app/images',
        javascriptsDir: 'app/pages',
        fontsDir: 'app/styles/fonts',
        importPath: 'app/components',
        relativeAssets: true
      },
      dist: {},
      server: {
        options: {
          debugInfo: true
        }
      }
    },
    concat: {
      dist: {
        files: {
          'dist/scripts/scripts.js': [
            '.tmp/pages/**/*.js',
            'app/pages/**/*.js'
          ]
        }
      }
    },
    html_src: {
      dist: {
        files: {
          'app/index.html': ['app/pages/app.js','app/pages/**/*.js']
        }
      }
    },
    useminPrepare: {
      html: 'app/index.html',
      options: {
        dest: 'dist'
      }
    },
    usemin: {
      html: ['dist/**/*.html'],
      css: ['dist/styles/**/*.css'],
      options: {
        dirs: ['dist']
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'app/images',
          src: '**/*.{png,jpg,jpeg}',
          dest: 'dist/images'
        }]
      }
    },
    cssmin: {
      dist: {
        files: {
          'dist/styles/main.css': [
            '.tmp/styles/**/*.css',
            'app/styles/**/*.css'
          ]
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: 'app',
          src: ['*.html', 'pages/**.html'],
          dest: 'dist'
        }]
      }
    },
    cdnify: {
      dist: {
        html: ['dist/*.html']
      }
    },
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'dist/scripts',
          src: '*.js',
          dest: 'dist/scripts'
        }]
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/scripts/scripts.js': [
            'dist/scripts/scripts.js'
          ]
        }
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            'dist/scripts/**/*.js',
            'dist/styles/**/*.css',
            'dist/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
            'dist/styles/fonts/*'
          ]
        }
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'app',
          dest: 'dist',
          src: [
            '*.{ico,txt}',
            '.htaccess',
            'components/**/*',
            'images/**/*.{gif,webp}',
            'styles/fonts/*'
          ]
        }]
      }
    }
  });

  grunt.registerTask('server', [
    'clean:server',
    'coffee:dist',
    'html_src',
    'compass:server',
    'connect:pushstate',
    'open',
    'watch'
  ]);

  grunt.registerTask('test', [
    'clean:server',
    'coffee',
    'compass',
    'connect:test',
    'jshint',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'jshint',
    'test',
    'coffee',
    'html_src',
    'compass:dist',
    'useminPrepare',
    'imagemin',
    'cssmin',
    'htmlmin',
    'concat',
    'copy',
    'cdnify',
    'ngmin',
    'uglify',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', ['build']);

  // automatically put javascript tags into index.html
  grunt.registerMultiTask('html_src', 'Rebuild static HTML files with file paths', function() {
    this.files.forEach(function(f) {
      var orig_src = grunt.file.read(f.dest);
      var src = ''+orig_src;
      var relative_path = f.dest.replace(/[^/]*?$/,'');

      // add our own script references
      var script_tags = "<!-- html_src start -->\n";
      f.src.map(function(filepath) {
        script_tags += "    <script src=\"" + filepath.replace(relative_path,"") + "\" type=\"text\/javascript\"></script>\n";
      });
      script_tags += "    <!-- html_src end -->";

      // remove existing tags
      src = src.replace(/<!-- html_src start -->[\s\S]+?<!-- html_src end -->/,script_tags);

      if (src !== orig_src) {
        grunt.log.writeln('File "' + f.dest + '" updated.');
        grunt.file.write(f.dest, src);
      }

    });
  });

};