/**
 * Created by lenovo on 2016/4/4.
 */
$(document).ready(function () {

  var handleNewOrderList = function (rows) {

      var list = '';

      rows.forEach(function (row) {
        /*list += "<li><span class='orderId' style='display: none'>"+ row._id +"</span><img src='/uploadData/"+ row.imagePath +"' class='c-part2-new-ul-img'>" +
          "<div class='c-part2-new-ul-img-price fr'>￥" + row.price +
          "</div><div class='c-part2-detail'> <p class='c-part2-detail-goodsName'>" + row.goodsName +
          "</p><p class='c-part2-detail-describe'>" + row.describe + "</p> </div> </li>";*/
        var focusStr = '', outNumStr = '';
        if (row.focus) {
          focusStr += '<p class="focus-box"> <img src="/images/icon-focus.jpg" class="icon-focus"> ' +
          '<span>'+row.focus+'</span> </p>'
        }

        if (row.outNum) {
          outNumStr += '<p class="outNum-box">已售出：<span class="out-num">'+
          row.outNum+'</span> </p>'
        }
        list += "<li><span class='orderId' style='display: none'>"+ row._id +"</span><img src='/uploadData/"+ row.imagePath +"' class='c-part2-new-ul-img'>" +
        "<div class='c-part2-new-ul-img-price fr'>￥" + row.price +
        "</div><div class='c-part2-detail'> <p class='c-part2-detail-goodsName'>" + row.goodsName +
        "</p><p class='c-part2-detail-describe'>" + row.describe + "</p> </div> "+
        focusStr + outNumStr +"</li>";
      });

      return list;
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
            +"'><span class='recommend-detail' title='"+ rows[newInt].goodsName +"'>"+ rows[newInt].goodsName +"</span></a></div>";
          oldIntArray.push(newInt);
        }
        test(oldIntArray);

      } else if (oldIntArray.length === 0) {
        recommendList += "<div class='recommend-link'><span class='orderId' style='display: none'>"+ rows[newInt]._id
          +"</span><img src='/uploadData/"+ rows[newInt].imagePath
          +"'><span class='recommend-detail' title='"+ rows[newInt].goodsName +"'>"+ rows[newInt].goodsName +"</span></div>";
        oldIntArray.push(newInt);
        test(oldIntArray);
      }
    })(oldIntArray);

    $('.recommend').html(recommendList);
  };

  var wordLimit = function () {
    var $describe = $("#orderList").find('.c-part2-detail-describe');
      var maxWidth=50;
    $describe.each(function () {
      if($(this).html().length > maxWidth){
        $(this).html($(this).html().substring(0, maxWidth));
        $(this).html($(this).html()+'...');
      }
    });
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

            $('#orderList').html(handleNewOrderList(rows));
            handleRecommendOrderList(dataLength, rows);
            wordLimit();
          },
          error: function () {}
        });
      },

    search: function (codeId) {
      $.ajax({
        url: '/classSearch',
        type: 'get',
        data: {codeId: codeId},
        dataType: 'json',
        success: function () {},
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

    $('.order-class-nav > li').on('click', function () {
      var codeId = $(this).index();
      //ajaxList.search(codeId);
    });

    $('.avatar, .personal-center').hover(function () {
      $('.center-nav').show();
    },function () {
      $('.center-nav').hide();
    });

    $('.search-btn').on('click', function () {
      var searchKeyWorld = $('.search-input').val();
      if (searchKeyWorld !== '') {
        window.location.href = 'http://localhost:10011/inputSearch/' + searchKeyWorld;
      }
    });

    //icon 效果
    $('.icon-cart').hover(function (event) {
      event.stopPropagation();
      $('.icon-cart-txt').fadeIn(500);
    }, function (event) {
      event.stopPropagation();
      $('.icon-cart-txt').fadeOut(500);
    });

  };

  init();
});
