gulp = require 'gulp'
run = require 'gulp-run'
argv    = require('yargs').argv

serverMode = argv.s or "debug"

gulp.task 'compile', ['publish'], ->
	run('./tools/compile.sh').exec()

gulp.task 'copyFile', ['compile'], ->
	run('./tools/copyFile.sh').exec()

gulp.task 'server', ->
	run('./tools/server.sh').exec()

gulp.task 'build', ['compile'], ->
	run("./tools/server.sh #{serverMode}").exec()

gulp.task 'publish', ->
	run('./tools/publish.sh').exec()