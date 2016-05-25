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
          url: '/getFocusStatus',
          type: 'get',
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
              $goodsFocus.removeClass('on-focus').val('关注一下');
            } else {
              $goodsFocus.addClass('on-focus').val('取消关注');
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

    $('.toCart').on('click', function () {
      $.ajax({
        url: '/addCartOrder',
        type: 'get',
        data: {'orderId' : orderId},
        dataType: 'json',
        success: function (resMsg) {
          if (resMsg) {
            $('.warning-cart').fadeIn(500);
            setTimeout(function () {
              $('.warning-cart').fadeOut(500);
            }, 2000);
          }
        }.bind($(this)),
        error: function () {}
      });
    });

    $('.cmt').on('click',function(){
      var write = $('.comment-write');
      if( write.is(':visible')){
        write.slideUp(900);
        $('.cmt').html('写评论');
      }else{
        write.slideDown(900);
        $('.cmt').html('收起');
      }
    });

    $("#cmt-btn").on('click',  function(event) {
      event.preventDefault();
      var con = $('.cmt-write').val();
      var gid = $('.orderId').html();
      var orderUper = $('.goods-username').html();
      if(con == '' || gid == '') return false;
      $.ajax({
        url: '/addCmt',
        type: 'get',
        data: {}
      });
      $.post('index.php?m=home&c=index&a=addcommet', {gid: gid,con:con}, function(msg) {
        if(!msg.status){
          alert(msg.info);
        }else{
          var data = msg.data;
          var res = '<p class="comment-list"> <span class="cmt-list-content">'+data.con+'</span> <span class="cmt-list-time cmt-list-other">'+data.time+'</span><span class="cmt-list-neme cmt-list-other">'+data.name+'</span> </p>';
          $(res).prependTo('.comment-content');
          $('.cmt').trigger('click');
        }
      },'json');
    });

  };

  init();
});
