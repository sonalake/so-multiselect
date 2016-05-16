// Karma configuration for Unit tests
// http://karma-runner.github.io/0.10/config/configuration-file.html
module.exports = function(config) {
	var conf = {};

	conf.basePath = '',
	conf.frameworks = ['jasmine'],
	conf.reporters = ['progress', 'coverage'],

	// Start these browsers, currently available:
	// - Chrome
	// - ChromeCanary
	// - Firefox
	// - Opera
	// - Safari (only Mac)
	// - PhantomJS
	// - IE (only Windows)
	conf.browsers = ['PhantomJS'],
	conf.autoWatch = true,

	// these are default values anyway
	conf.singleRun = false,
	conf.colors = true,

	// Extra files needed just for Unit tests (including the actual unit test files)
	conf.files = [
		//3rd Party Code
		'../src/vendor/jquery/jquery.js',
		'../src/vendor/jasmine-jquery/lib/jasmine-jquery.js',
		'../src/vendor/angular/angular.js',
		'../src/vendor/angular-mocks/angular-mocks.js',
		
		//App source files
		'../src/js/**/*.module.js',
		'../src/js/**/*.js',

		//test files
		'unit/**/*.js'
	];
	conf.preprocessors = {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      '../src/js/**/*.js': ['coverage']
    };

    // optionally, configure the reporter
    conf.coverageReporter = {
      type: 'lcov',
      dir: '..',
      subdir: 'coverage'
    };

	// level of logging
	// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
	// conf.logLevel = config.LOG_DEBUG;

	config.set(conf);
};