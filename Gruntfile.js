module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*']
    });

    grunt.initConfig({

        browserify: {
            options: {
                sourceMap: true,
                transform: [
                    ['babelify', {
                        loose: 'all'
                    }]
                ]
            },
            background: {
                files: {
                    './extension/background.js': ['./src/js/background.js']
                }
            },
            popup: {
                files: {
                    './extension/popup.js': ['./src/js/popup.js']
                }
            }
        },

        clean: ['production/'],

        copy: {
            prod: {
                cwd: 'extension/',
                src: '**/*',
                dest: 'production',
                expand: true
            }
        },

        // Minifies JS files from the JS folder into deploy folder
        uglify: {
            options: {
                mangle: false
            },
            js: {
                files: {
                    'production/popup.js': 'production/popup.js',
                    'production/background.js': 'production/background.js'
                }
            }
        },

        // Minifies the main.css file inside the styles folder into the deploy folder as main.min.css
        cssmin: {
            minify: {
                expand: true,
                cwd: 'production/',
                src: ['*.css'],
                dest: 'production'
            }
        },

        watch: {
            js: {
                files: ['src/**/*.js'],
                tasks: ['browserify']
            }
        }

    });

    grunt.registerTask('release', ['clean', 'copy:prod', 'cssmin', 'uglify']);

    grunt.registerTask('dev', ['browserify', 'watch']);

};