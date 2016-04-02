/**
 * Created by lenovo on 2016/3/26.
 */
module.exports = function (gulp, plugins, config) {
    gulp.task('watch', function () {
        gulp.watch(config.sassPath, ['sass']);
        gulp.watch(config.jsPath, ['js']);
    });

    gulp.task('start', function () {
        plugins.runSequence(['watch']);
    });
};

