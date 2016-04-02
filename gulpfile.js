/**
 * Created by lenovo on 2016/3/26.
 */
var gulp = require('gulp'),
    plugins = require('gulp-load-plugins'),
    /*gulpLists = require('fs').readdirSync('./gulp/tasks'),
    webserver = require('gulp-webserver'),*/
    sass = require('gulp-sass');

plugins.runSequence = require('run-sequence');

gulp.task('sass', function () {
    gulp.src('dev/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('dev/css'));
});

/*gulp.task('js', function () {
    gulp.src('dev/js/!*.js')
        .pipe(gulp.dest('dev/js'))
});*/

gulp.task('watch', function () {
    gulp.watch('dev/sass/*.scss', ['sass']);
    //gulp.watch('dev/js/*.js', ['js']);
});

gulp.task('default', function () {
    gulp.start('sass', 'watch');
});

