/**
 * Created by lenovo on 2016/4/4.
 */
$(document).ready(function () {
    /*var path = window.location.href.split('?')[1];
    var user = {
        username: path.split('=')[1]
    };
    $('#personName').text(user.username);*/
    $(window).load(function () {
        $.ajax({
            url: '/initLoad',
            type: 'post',
            dataType: 'json',
            data : '',
            timeout: 30000,
            success: function (res) {},
            error: function () {}
        });
    });
});
