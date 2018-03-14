gulp = require 'gulp'
run	= require 'gulp-run'

gulp.task 'build', ->
	run('./tools/build.sh').exec()

gulp.task 'publish', ->
	run('./tools/publish.sh').exec()

gulp.task 'default', ->
	console.log("Tips: use gulp build to maka game.js !")
