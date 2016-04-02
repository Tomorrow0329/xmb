/**
 * Created by lenovo on 2016/3/26.
 */
module.exports = function (gulp, plugins, config, sass) {
    gulp.task('sass', function () {
        gulp.src(config.sassPath)
            .pipe(sass({outputStyle:'expanded'}).on('error', sass.logError))
            .pipe(gulp.dest(config.cssPath));
    });

    gulp.task('js', function () {
        gulp.src(config.jsPath)
            .pipe(gulp.dest(config.jsPath))
    });

    gulp.task('default', function () {
        gulp.start('sass', 'js');
    });
};
