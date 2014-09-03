module.exports = function(grunt) {

     'use strict';

    /**
     *
     * NOTE!
     * Install dependencies: npm install
     * Update external liberies: bower update
     * Build project: grunt build
     * When developing: grunt html
     *
    **/
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        project: {
            name: '<%= pkg.name %>',
            version: '<%= pkg.version %>'
        },

        // Bower Concat
        bower_concat: {
            all: {
                dest: 'src/assets/js/_bower.js',
                exclude: [
                    'modernizr'
                ],
                dependencies: {
                    'sass-bootstrap': 'jquery',
                    'owl.carousel': 'jquery',
                },
                bowerOptions: {
                    relative: false
                }
            }
        },

        // SASS
        sass: {
            dist: {
                options: {
                    outputStyle: 'compressed',
                    sourceComments: 'none'
                },
                files: [
                    {
                        src: 'src/assets/gfx/styles_screen.scss',
                        dest: 'build/assets/gfx/styles_screen.min.css'
                    },
                ]
            }
        },

        // Concat
        concat: {
            js: {
                options: {
                    banner: '/* Package Name:<%= project.name %>, Version:<%= project.version %>, Date:<%= grunt.template.today("dd-mm-yyyy") %> */\n'
                },
                src: [
                    'src/assets/js/modernizr.custom.js',
                    'src/assets/js/_bower.js',
                ],
                dest: 'src/assets/js/plugins.js'
            }
        },

        // Min JS
        min: {
            dist: {
                files: [
                    {
                        src: 'src/assets/js/plugins.js',
                        dest: 'build/assets/js/plugins.min.js'
                    },
                    {
                        src: 'src/assets/js/app.js',
                        dest: 'build/assets/js/app.min.js'
                    }
                ]
            },
            js: {
                files: [
                    {
                        src: 'src/assets/js/app.js',
                        dest: 'build/assets/js/app.min.js'
                    }
                ]
            }
        },

        // Images
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'src/assets/gfx/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'build/assets/gfx/'
                }]
            }
        },

        // Watch
        watch: {
            html: {
                files: ['src/templates/**/*.mustatic'],
                tasks: ['jshint', 'clean', 'mustatic']
            },
            sass: {
                files: ['src/assets/gfx/styles_screen.scss'],
                tasks: ['sass']
            },
            css: {
                files: ['src/assets/gfx/styles_screen.css'],
                tasks: ['cssmin:styles']
            },
            js: {
                files: ['src/assets/js/app.js'],
                tasks: ['min:js']
            },
            images: {
                files: ['src/assets/gfx/*.{gif,GIF,jpg,JPG,png,PNG}'],
                tasks: ['imagemin']
            }
        },

        // mustatic
        mustatic: {
            options: {
                src: 'src/templates',
                dest: 'build',
                ext: 'mustatic',
                navStates : true
            },
            build: {
                globals: {
                    lang    : 'en',
                    charset : 'utf-8',
                    assets: 'http://localhost/grunt-based-static-web/build/assets'
                }
            }
        },

        // jshint
        jshint: {
            all: [
                'Gruntfile.js',
                'src/templates/**/*.json'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Clean
        clean: {
            build: ['build/**/*.html']
        }

    });

    // Load Npm Tasks

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-yui-compressor');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('dbushell-grunt-mustatic');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-sass');

    // Tasks

    grunt.registerTask('html', ['watch']);
    grunt.registerTask('build', ['bower_concat', 'concat', 'sass', 'min:dist', 'imagemin', 'jshint', 'clean', 'mustatic']);

};
