/**
 * Created by 111 on 16/4/8.
 */
$(document).ready(function () {

  var orderId = $('.orderId').html(),
    focusStatus = false;

  var ajaxList = {
      getFocus: function () {
        $.ajax({
          url: '/getFocus',
          type: 'post',
          data: {'orderId' : orderId},
          dataType: 'json',
          success: function (status) {
            focusStatus = status.focusStatus;
            if (focusStatus === true) {
              $('.c-goods-focus').addClass('on-focus').val('取消关注');
            } else {
              $('.c-goods-focus').removeClass('on-focus').val('关注一下');
            }
          },
          error: function () {}
        });
      },
      setFocus: function () {
        $.ajax({
          url: '/orderFocus',
          type: 'post',
          data: {'orderId' : orderId},
          dataType: 'json',
          success: function (res) {
            focusStatus = res.focusStatus;
            if (res.focusStatus === true) {
              $('.c-goods-focus').addClass('on-focus').val('取消关注');
            } else {
              $('.c-goods-focus').removeClass('on-focus').val('关注一下');
            }
          }
          ,
          error: function () {}
        });
      },
      cancelFocus: function () {
        $.ajax({
          url: '/orderCancelFocus',
          type: 'post',
          data: {'orderId' : orderId},
          dataType: 'json',
          success: function (res) {
            if (res.focusStatus === true) {
              $('.c-goods-focus').addClass('on-focus').val('取消关注');
            } else {
              $('.c-goods-focus').removeClass('on-focus').val('关注一下');
            }
          }
          ,
          error: function () {}
        });
      }
  };

  var init = function () {
    ajaxList.getFocus();

    $('.c-goods-focus').on('click', function () {

      if (!focusStatus) {
        ajaxList.setFocus();
      } else {
        ajaxList.cancelFocus();
      }
    });
  };

  init();
});
