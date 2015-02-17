;(function () {
    'use strict';

    module.exports = function (grunt) {
        require('load-grunt-tasks')(grunt, {
            pattern: ['grunt-*', '!grunt-template-jasmine-istanbul']
        });
        require('time-grunt')(grunt);

        // Project configuration.
        grunt.initConfig({

            // Metadata.
            pkg: grunt.file.readJSON("package.json"),
            banner: '/* ' +
                '<%= pkg.title || pkg.name %> - <%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> - ' +
                'Copyright (c) <%= grunt.template.today("yyyy") %> Informatik der Arbeitslosenversicherung; */\n',

            // Task configurations.
            clean: {
                all: ['dist', 'build'],
                dist: ['dist'],
                build: ['build']
            },
            concat: {
                options: {
                    separator: ';',
                    banner: '<%= banner %>'
                },
                forms: {
                    src: ['src/ng/alv-ch-ng.ui-forms.js', 'src/ng/alv-ch-ng.ui-forms.templates.js','lib/ng-lodash/build/ng-lodash.js','lib/bootstrap-datepicker/js/locales/bootstrap-datepicker.de.js','lib/bootstrap-datepicker/js/locales/bootstrap-datepicker.fr-CH.js','lib/bootstrap-datepicker/js/locales/bootstrap-datepicker.it-CH.js','lib/bootstrap-datepicker/js/locales/bootstrap-datepicker.en-GB.js'],
                    dest: 'dist/alv-ch-ng.ui-forms.js'
                }
            },
            uglify: {
                options: {
                    banner: '<%= banner %>'
                },
                prod: {
                    files: {
                        'dist/alv-ch-ng.ui-forms.min.js': ['dist/alv-ch-ng.ui-forms.js']
                    }
                }
            },
            less: {
                prod: {
                    options: {
                        paths: ['src/less'],
                        compress: false,
                        cleancss: true,
                        ieCompat: true
                    },
                    files: {
                        'dist/css/selectpicker.css': ['src/less/selectpicker.less']
                    }
                }
            },
            cssbeautifier: {
                options: {
                    banner: '<%= banner %>'
                },
                prod: {
                    files: {
                        'dist/css/selectpicker.css': ['dist/css/selectpicker.css']
                    }
                }
            },
            cssmin: {
                options: {
                    banner: '<%= banner %>'
                },
                prod: {
                    files: {
                        'dist/css/selectpicker.min.css': ['dist/css/selectpicker.css']
                    }
                }
            },
            compress: {
                main: {
                    options: {
                        mode: 'gzip'
                    },
                    files: [
                        { src: ['dist/alv-ch-ng.ui-forms.min.js'], dest: 'dist/alv-ch-ng.ui-forms.min.js' },
                        { src: ['dist/css/selectpicker.min.css'], dest: 'dist/css/selectpicker.min.css' }
                    ]
                }
            },
            jasmine: {
                unit: {
                    src: [
                        'src/ng/*.js'
                    ],
                    options: {
                        specs: ['test/unit/**/*.unit.spec.js'],
                        helpers: 'test/unit/helpers/*.helper.js',
                        vendor: [
                            'lib/jquery/dist/jquery.js',
                            'lib/jasmine-jquery/lib/jasmine-jquery.js',
                            'lib/angular/angular.js',
                            'lib/angular-mocks/angular-mocks.js',
                            'lib/angular-translate/angular-translate.js',
                            'lib/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
                            'lib/angular-translate-storage-local/angular-translate-storage-local.js',
                            'lib/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
                            'lib/ng-lodash/build/ng-lodash.js',
                            'node_modules/grunt-contrib-jasmine/vendor/jasmine-2.0.0/jasmine.js'
                        ],
                        version: '2.0.0',
                        template: require('grunt-template-jasmine-istanbul'),
                        templateOptions: {
                            coverage: 'build/coverage/coverage.json',
                            report: [
                                {
                                    type: 'html',
                                    options: {
                                        dir: 'build/coverage/reports/html'
                                    }
                                },
                                {
                                    type: 'lcov',
                                    options: {
                                        dir: 'build/coverage/reports/lcov'
                                    }
                                },
                                {
                                    type: 'text-summary'
                                }
                            ]
                        }
                    }
                }
            },
            coveralls: {
                options: {
                    force: false
                },
                all: {
                    src: 'build/coverage/reports/lcov/lcov.info'
                }
            },
            push: {
                options: {
                    files: ['package.json'],
                    updateConfigs: [],
                    releaseBranch: 'master',
                    add: true,
                    addFiles: ['*.*', 'dist/**', 'src/**', 'test/**'], // '.' for all files except ignored files in .gitignore
                    commit: true,
                    commitMessage: 'Release v%VERSION%',
                    commitFiles: ['*.*', 'dist/**', 'src/**', 'test/**'], // '-a' for all files
                    createTag: true,
                    tagName: 'v%VERSION%',
                    tagMessage: 'Version %VERSION%',
                    push: false,
                    npm: false,
                    gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
                }
            },
            jshint: {
                gruntfile: {
                    options: {
                        jshintrc: '.jshintrc'
                    },
                    src: 'Gruntfile.js'
                },
                src: {
                    options: {
                        jshintrc: '.jshintrc'
                    },
                    src: ['src/**/*.js']
                },
                test: {
                    options: {
                        jshintrc: 'test/.jshintrc'
                    },
                    src: ['test/**/*.js', '!test/dev/*.js', '!test/**/helpers/*.helper.js', '!test/e2e/**']
                }
            },
            lesslint: {
                options: {
                    csslint: {
                        csslintrc: '.csslintrc'
                    },
                    imports: ['src/less/**/*.less']
                },
                src: ['src/less/selectpicker.less']
            }
        });

        // Tests
        grunt.registerTask('unit-test', ['jasmine']);
        grunt.registerTask('jshint-test', ['jshint']);
        grunt.registerTask('lesslint-test', ['lesslint']);

        grunt.registerTask('all-test', ['lesslint-test', 'htmlhint:templates', 'jshint-test', 'unit-test']);
        // CI
        grunt.registerTask('travis', ['jshint', 'clean:build', 'unit-test', 'coveralls']);

        // Default task.
        grunt.registerTask('default', ['clean:all','all-test','less:prod','cssbeautifier','cssmin','concat','uglify:prod']);
    };


})();