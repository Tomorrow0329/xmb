/**
 * Created by 111 on 16/4/8.
 */
$(document).ready(function () {

  var orderId = $('.orderId').html(),
    focusStatus = false,
    $goodsFocus = $('.c-goods-focus');

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
              $goodsFocus.addClass('on-focus').val('取消关注');
            } else {
              $goodsFocus.removeClass('on-focus').val('关注一下');
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
              $goodsFocus.addClass('on-focus').val('取消关注');
            } else {
              $goodsFocus.removeClass('on-focus').val('关注一下');
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
              $goodsFocus.addClass('on-focus').val('取消关注');
            } else {
              $goodsFocus.removeClass('on-focus').val('关注一下');
            }
          }
          ,
          error: function () {}
        });
      }
  };

  var init = function () {
    $goodsFocus.val('关注一下');
    ajaxList.getFocus();

    $goodsFocus.on('click', function () {

      if (!focusStatus) {
        ajaxList.setFocus();
      } else {
        ajaxList.cancelFocus();
      }
    });
  };

  init();
});
