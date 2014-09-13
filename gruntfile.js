/**
* Created with devFestSite-2014.
* User: jefBinomed
* Date: 2014-03-19
* Time: 08:52 PM
* To change this template use Tools | Templates.
*/
module.exports = function (grunt) {

  // Configuration du build
  grunt.initConfig({

    package: grunt.file.readJSON('package.json'),

    //////////////////////////////////////////////////
    //////////////////////////////////////////////////
    //// PARAMETERS FOR TASK
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////

    
    /*
    * SOURCE
    **/
    src: {
      html: {
        root:'./www',
        dir: 'partials',
        index: 'index.html',
        all : '**/*.html'
      },
      js:   {
        all: 'js/**/*.js',
        dir: 'js'
      }, 
      scss: {
        all: 'www/scss/**/*.scss',
        dir: 'www/scss/'
      },
      css: {
        all: 'www/css/**/*.css',
        dir: 'www/css/'
      }

    },
    
   
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////
    //// DEVELOPMENT TASKS
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////

    'http-server': {
      'dev': {

            // the server root directory
            root: "./www/",

            port: 8080,

            host: "127.0.0.1",

            cache: 0,
            showDir : true,
            autoIndex: true,
            defaultExt: "html",

            // run in parallel with other tasks
            runInBackground: true

        }
    },

    /*
    * Compass Task
    */
    compass: {
      app: {
        options: {
          sassDir: '<%= src.scss.dir %>',
          cssDir: '<%= src.css.dir %>'
        }
      }
    },

   
   /* browser_sync:{
      files: [
        '<%= src.css.all %>',
        '*.html',
        'partials/*.html',
        'javascript/*.js'
      ],
      options:{
        server: {
          baseDir: "./"
        },
        watchTask:true,
        host:'127.0.0.1',
        port:8080
      }
    },    */
   
    // Watch Configuration : compilation sass/compass + livereload 

    watch: {
      options: {
        livereload: true
      },
      sass: {
        files: ['<%= src.scss.all %>'],
        tasks: ['compass']
      },
      html: {
        files: [
          '*.html',
          './www/*.html',
          './www/partials/*.html'
        ]
      },
      js: {
        files: [
          './www/js/*.js'
        ]
      }
    },

  });

  // Chargement des plugins
  require('load-grunt-tasks')(grunt);

  // Déclaration des taches
  grunt.registerTask('serve',        ['http-server:dev', 'watch']);  

};