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
            type: 'get',
            dataType: 'json',
            timeout: 30000,
            success: function (res) {
              var rows = res.rows, list = '';
              rows.forEach(function (row) {
                list += "<li> <img src='/uploadData/"+ row.imagePath +"' class='c-part2-new-ul-img'>" +
                "<div class='c-part2-new-ul-img-price fr'>￥" + row.price +
                  "</div><div class='c-part2-detail'> <p class='c-part2-detail-goodsName'>" + row.goodsName +
                  "</p><p class='c-part2-detail-describe'>" + row.describe + "</p> </div> </li>";
              });

              $('#orderList').html(list);
            },
            error: function () {}
        });
    });
});
