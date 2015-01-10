module.exports = function(grunt) {

  grunt.initConfig({
	pkg : grunt.file.readJSON('package.json'),
      connect: {
        server: {
          options: {},
        }
      },
      sass: {
        dist: {
          options: {
            style: 'compressed'
          },
          files: {
            'styles/app.css': 'styles/scss/app.scss',
          }
        }
      },
      concat: {
        // Setup concat of the components some day
        // components: {
        //   src: ['app/scripts/directives/directives.header', 'app/scripts/directives/*.js'],
        //   dest: 'app/scripts/directives.js'
        // },
        css: {
          src: ['styles/app.css'],
          dest: 'styles/app.css'
        }
      },
      nggettext_extract: {
          pot: {
              files: {
                  'po/template.pot': ['./*.html', './*/*.html']
              }
          },
      },
      nggettext_compile: {
          all: {
              files: {
                  'translations.js': ['po/*.po']
              }
          },
      },
      watch: {
        options: {
          livereload: true,
        },
        html: {
          files: ['index.html', './*/*.html'],
          tasks: ['nggettext_extract']
        },
        sass: {
          options: {
            livereload: false
          },
          files: ['styles/scss/*.scss'],
          tasks: ['sass', 'concat:css'],
        },
        css: {
          files: [],
          tasks: ['-']
        }
        // Watch js for concatenations
      },
      
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-angular-gettext');

    grunt.registerTask('default', ['connect', 
      'nggettext_extract', 
      'nggettext_compile', 
      'sass', 
      'concat', 
      'watch']);
};