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
    gulp.src('public/stylesheets/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/stylesheets/css'));
});

/*gulp.task('js', function () {
    gulp.src('public/js/!*.js')
        .pipe(gulp.dest('public/js'))
});*/

gulp.task('watch', function () {
    gulp.watch('public/stylesheets/sass/*.scss', ['sass']);
    //gulp.watch('public/js/*.js', ['js']);
});

gulp.task('default', function () {
    gulp.start('sass', 'watch');
});

