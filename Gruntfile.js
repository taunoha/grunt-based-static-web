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
                    'sass-bootstrap': 'jquery-legacy',
                    'owl.carousel': 'jquery-legacy',
                },
                bowerOptions: {
                    relative: false
                }
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
                    }
                ]
            }
        },

        // Copy
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'bower_components/bootstrap-sass/lib/',
                        src: ['*'],
                        dest: 'src/assets/gfx/bootstrap-sass/lib',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/bootstrap-sass/fonts/',
                        src: ['*'],
                        dest: 'src/assets/gfx/bootstrap-sass/fonts/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/owl.carousel/dist/assets/',
                        src: ['owl.carousel.min.css'],
                        dest: 'build/assets/gfx/owl.carousel/',
                        filter: 'isFile'
                    },
                ]
            }
        },

        // mustatic
        mustatic: {
            options: {
                src: 'src/templates',
                dest: 'build',
                ext: 'mustatic',
                navStates: true
            },
            build: {
                globals: {
                    lang    : 'en',
                    charset : 'utf-8',
                    assets: 'http://localhost:<%= connect.options.port %>/assets'
                }
            }
        },

        // Prettify
        prettify: {
            options: {
                indent: 4
            },
            all: {
                expand: true,
                cwd: 'build/',
                ext: '.html',
                src: ['*.html'],
                dest: 'build/'
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
        },

        // Watch
        watch: {
            html: {
                files: ['src/templates/**/*.mustatic'],
                tasks: ['jshint', 'mustatic', 'prettify'],
                options: {
                    livereload: true
                }
            },
            sass: {
                files: ['src/assets/gfx/styles_screen.scss'],
                tasks: ['sass'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['src/assets/js/app.js'],
                tasks: ['min:js'],
                options: {
                    livereload: true
                }
            },
            images: {
                files: ['src/assets/gfx/*.{gif,GIF,jpg,JPG,png,PNG}'],
                tasks: ['imagemin'],
                options: {
                    livereload: true
                }
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    'build/*.html',
                    'build/assets/gfx/*.css',
                    'build/assets/gfx/*.{gif,jpeg,jpg,png,svg}',
                ]
            }
        },

        // Connect. Opens the default browser. Reloads application automatically (according to Watch task rules)
        connect: {
            options: {
                port: 9000,
                hostname: 'localhost',
                base: 'build'
            },
            livereload: {
                options: {
                    open: true
                }
            }
        },
        open: {
            server: {
                url: 'http://localhost:<%= connect.options.port %>'
            }
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
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-prettify');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Tasks

    grunt.registerTask('html', ['connect:livereload', 'watch']);
    grunt.registerTask('build', ['bower_concat', 'copy', 'concat', 'sass', 'min:dist', 'imagemin', 'jshint', 'clean', 'mustatic', 'prettify']);

};
