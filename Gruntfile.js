'use strict';

/*global module:false*/
module.exports = function(grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Project configuration.
	grunt.initConfig({
		// definition of pkg variable
		pkg: grunt.file.readJSON('package.json'),
		// the directory containing the source code
		appDir: 'src',
		// the directory containing the distribution code
		buildDir: 'dist',
		// definition of banner variable
		banner: '/*! <%= pkg.name %> - <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
			' * Copyright (c) <%= grunt.template.today("yyyy") %> Sonalake;\n' +
			' */\n',
		
		// Empties dist directories
		clean: ['<%= buildDir %>'],
		// configuration for concatting all the src files together
		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
			dist: {
				src: ['<%= appDir %>/helpers/intro.js', '<%= appDir %>/js/**/*.js', '<%= appDir %>/helpers/outro.js'],
				dest: '<%= buildDir %>/<%= pkg.name %>.js'
			}
		},
		// configuration for JSHint
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: [
				'Gruntfile.js',
				'<%= buildDir %>/*.js'
			]
		},
		// configuration of obfuscating the code
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				files: {
					'<%= buildDir %>/<%= pkg.name %>.min.js': ['<%= buildDir %>/<%= pkg.name %>.js']
				}
			}
		},
		// Compiles the less code into CSS
		less: {
			dist: {
				options: {
					banner: '/*! <%= pkg.name %> - <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
					' * Copyright (c) <%= grunt.template.today("yyyy") %> Sonalake;\n' +
					' */',
					syncImport: true
				},
				files: {
					'<%= buildDir %>/so-multiselect.css': '<%= appDir %>/less/multiselect.less'
				}
			}
		},
		// sets up a local server for runnning tests on
		connect: {
			options: {
				port: 9000,
				// Change this to '0.0.0.0' to access the server from outside.
				hostname: 'localhost'
			},
			test: {
				options: {
					port: grunt.option('test_port') || 9001,
					browserName: grunt.option('browser_name') || 'chrome',
					base: [
						'.tmp',
						'test',
						'<%= appDir %>',
						'<%= buildDir %>',
						'test/e2e'
					]
				}
			}
		},
		// configuration for unit tests
		karma: {
			travis: {
				configFile: 'test/unit.conf.js',
				singleRun: true,
				autoWatch: false,
				reporters: ['dots', 'coverage'],
				browsers: ['Firefox']
			},
			unit: {
				configFile: 'test/unit.conf.js',
				autoWatch: false,
				singleRun: true
			}
		},
		protractor: {
			options: {
				configFile: 'node_modules/protractor/referenceConf.js', // Default config file
				keepAlive: true, // If false, the grunt process stops when the test fails.
				// noColor: false, // If true, protractor will not use colors in its output.
				args: {
			         // Arguments passed to the command
				}
			},
			e2e: {
				options: {
					configFile: 'test/e2e.conf.js', // Target-specific config file
					args: {
						baseUrl : 'http://localhost:<%= connect.test.options.port%>',
						capabilities: {
							browserName: '<%= connect.test.options.browserName%>',
						}

					} // Target-specific arguments
				}
			},
			travis: {
				options: {
					configFile: 'test/e2e.conf.js', // Target-specific config file
					args: {
						baseUrl : 'http://localhost:<%= connect.test.options.port%>',
						capabilities: {
							browserName: 'firefox',
						}

					} // Target-specific arguments
				}
			}
		}
	});

	// Test task
	grunt.registerTask('test', ['connect:test', 'karma:unit', 'protractor:e2e']);

	// Build task
	grunt.registerTask('build', ['clean', 'concat', 'jshint:all', 'uglify', 'less']);
	
	// Test task
	grunt.registerTask('ci', ['connect:test', 'karma:travis', 'protractor:travis']);

	// Default task (i.e. 'grunt')
	grunt.registerTask('default', ['test', 'build']);
};
