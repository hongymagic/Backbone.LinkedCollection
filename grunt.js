module.exports = function (grunt) {

	grunt.initConfig({
		test: {
			file: ['test/**/*.js']
		},
		lint: {
			all: ['src/**/*.js', 'test/**/*.js']
		},
		jshint: {
			options: {
				white:  true,
				es5:    true,
				node:   false
			}
		}
	});

	// Load grunt.js plugins
	grunt.loadNpmTasks('grunt-contrib');

	// Default task
	grunt.registerTask('default', 'lint');

};
