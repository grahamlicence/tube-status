module.exports = function(grunt) {

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({


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
        }

    });

    grunt.registerTask('release', ['clean', 'copy:prod', 'cssmin', 'uglify']);

};
