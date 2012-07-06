module.exports = function (grunt) {

	grunt.initConfig({
		pkg: '<json:package.json>',

		/* Test, test, test */
		test: {
			file: ['test/**/*.js']
		},

		/* Code linter */
		lint: {
			all: ['src/**/*.js', 'test/**/*.js']
		},
		jshint: {
			options: {
				white:  true,
				es5:    true,
				node:   false
			}
		},

		/* Distribution */
		concat: {
			dist: {
				src: ['lib/RFC5988-parser.js', 'src/Backbone.LinkedCollection.js'],
				dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js',
				separated: ';'
			}
		}
	});

	// Load grunt.js plugins
	grunt.loadNpmTasks('grunt-contrib');

	// Default task
	grunt.registerTask('default', 'lint');

};
