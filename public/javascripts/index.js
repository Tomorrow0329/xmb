/**
 * Created by lenovo on 2016/4/4.
 */
$(document).ready(function () {

  var handleNewOrderList = function (rows) {

      var list = '';

      rows.forEach(function (row) {
        list += "<li><span class='orderId' style='display: none'>"+ row._id +"</span><img src='/uploadData/"+ row.imagePath +"' class='c-part2-new-ul-img'>" +
          "<div class='c-part2-new-ul-img-price fr'>￥" + row.price +
          "</div><div class='c-part2-detail'> <p class='c-part2-detail-goodsName'>" + row.goodsName +
          "</p><p class='c-part2-detail-describe'>" + row.describe + "</p> </div> </li>";
      });

      $('#orderList').html(list);
    };

  var compare = function (newInt, oldIntArray) {
    var status = true;
    oldIntArray.forEach(function (oldInt) {
      if (newInt === oldInt) {
        status = false;
      }
    });

    return status;
  };

  var handleRecommendOrderList = function (dataLength, rows) {

    var oldIntArray = [],
      recommendList = '';

    (function test (oldIntArray) {
      var newInt = parseInt(Math.random()*(dataLength-0+1)+0), status = false;
      if (oldIntArray.length > 0 && oldIntArray.length < 6) {

        if (compare(newInt, oldIntArray)) {
          recommendList += "<div class='recommend-link'><span class='orderId' style='display: none'>"+ rows[newInt]._id
            +"</span><img src='/uploadData/"+ rows[newInt].imagePath
            +"'><span class='recommend-detail'>"+ rows[newInt].goodsName +"</span></a></div>";
          oldIntArray.push(newInt);
        }
        test(oldIntArray);

      } else if (oldIntArray.length === 0) {
        recommendList += "<div class='recommend-link'><span class='orderId' style='display: none'>"+ rows[newInt]._id
          +"</span><img src='/uploadData/"+ rows[newInt].imagePath
          +"'><span class='recommend-detail'>"+ rows[newInt].goodsName +"</span></a></div>";
        oldIntArray.push(newInt);
        test(oldIntArray);
      }
    })(oldIntArray);

    $('.recommend').html(recommendList);
  };

  var ajaxList = {
      loadNewOrder: function () {
        $.ajax({
          url: '/initLoad',
          type: 'get',
          dataType: 'json',
          timeout: 30000,
          success: function (res) {
            var rows = res.rows,
              dataLength = rows.length - 1;

            handleNewOrderList(rows);
            handleRecommendOrderList(dataLength, rows);
          },
          error: function () {}
        });
      }
  };

  var init = function () {

    ajaxList.loadNewOrder();

    $('.order-focus').on('click', function () {
      window.location.href = "/orderOrderFocus";
    });

    $('#orderList').on('click', 'li', function () {
      var orderId = $(this).find('.orderId').html();

      window.location.href = "/orderDetail" + orderId;
    });

    $('.recommend').on('click', '.recommend-link', function () {
      var orderId = $(this).find('.orderId').html();

      window.location.href = "/orderDetail" + orderId;
    });


  };

  init();
});
