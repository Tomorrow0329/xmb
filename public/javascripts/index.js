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
              var rows = res.rows,
                list = '',
                dataLength = rows.length - 1,
                oldIntArray = [],
                recommendList = '';

              rows.forEach(function (row) {
                list += "<li> <img src='/uploadData/"+ row.imagePath +"' class='c-part2-new-ul-img'>" +
                "<div class='c-part2-new-ul-img-price fr'>￥" + row.price +
                  "</div><div class='c-part2-detail'> <p class='c-part2-detail-goodsName'>" + row.goodsName +
                  "</p><p class='c-part2-detail-describe'>" + row.describe + "</p> </div> </li>";
              });

              var compare = function (newInt, oldIntArray) {
                var status = true;
                oldIntArray.forEach(function (oldInt) {
                  if (newInt === oldInt) {
                    status = false;
                  }
                });

                return status;
              };

              (function test (oldIntArray) {
                var newInt = parseInt(Math.random()*(dataLength-0+1)+0), status = false;
                if (oldIntArray.length > 0 && oldIntArray.length < 6) {

                  if (compare(newInt, oldIntArray)) {
                    recommendList += "<a href=''><img src='/uploadData/"+ rows[newInt].imagePath +"'></a>";
                    oldIntArray.push(newInt);
                  }
                  test(oldIntArray);

                } else if (oldIntArray.length === 0) {
                  recommendList += "<a href=''><img src='/uploadData/"+ rows[newInt].imagePath +"'></a>";
                  oldIntArray.push(newInt);
                  test(oldIntArray);
                }
              })(oldIntArray);

              $('#orderList').html(list);
              $('.recommend').html(recommendList);
            },
            error: function () {}
        });
    });
});
