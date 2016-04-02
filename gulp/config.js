module.exports = function () {
    return {
        sassPath : './dev/sass/*.scss',
        jsPath : 'dev/js/*.js',
        cssPath : './dev/css',
        serverSrc : 'dev/',
        serverOption: {
            fallback : 'index.html',
            livereload : true,
            open : true,
            host : 'localhost',
            port : 10011
        }
    }
};