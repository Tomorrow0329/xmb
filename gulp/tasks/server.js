/**
 * Created by lenovo on 2016/3/26.
 */
module.exports = function (gulp, config, webserver) {
    gulp.task('server', function () {
        gulp.src('dev/')
            .pipe(webserver(config.serverOption));
    })
};