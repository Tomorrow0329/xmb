/**
 * Created by 111 on 16/4/12.
 */
$(document).ready(function () {
  var data = $('.orderData').html().toString();
  //data = data.split(',');

  var handleFocusList = function (orders) {
    var focusList = '';
    orders.forEach(function (order) {
      if (order) {
        if (order.num === 0) {
          focusList += "<tr><td class='order-id' style='display: none'>"+ order._id
          +"</td><td class='c-r-td-addLength'>"+ order.goodsName
          +"</td><td>"+ order.num
          +"</td><td>"+ order.price
          +"</td><td>"+ order.username
          +"</td><td>"+ order.tel
          +"</td><td>"+ order.email
          +"<td class='c-r-td-addLength'>" + order.date.split('T')[0]+"</td></td>"
          +"<td class='edit' id='correct' style='color:#dd2727;'>售 罄</td><td class='edit delete'>取消关注</td></tr>"

        } else {
          focusList += "<tr><td class='order-id' style='display: none'>"+ order._id
          +"</td><td class='c-r-td-addLength'>"+ order.goodsName
          +"</td><td>"+ order.num
          +"</td><td>"+ order.price
          +"</td><td>"+ order.username
          +"</td><td>"+ order.tel
          +"</td><td>"+ order.email
          +"<td class='c-r-td-addLength'>" + order.date.split('T')[0]+"</td></td>"
          +"<td class='edit cart' id='correct'>加入购物车</td><td class='edit delete'>取消关注</td></tr>"

        }
      } else {
        /*focusList += "<tr><td class='c-r-td-addLength'>商品已下架"
          +"</td><td>－－"
          +"</td><td>－－"
          +"</td><td>－－"
          +"</td><td>－－"
          +"</td><td>－－"
          +"<td class='c-r-td-addLength'>－－"+"</td></td>"
          +"<td class='unused' id='correct'>－－</td><td class='edit' id='delete'>删除</td></tr>"*/
      }
    });

    $('#c-r-tb > tbody').html(focusList);
  };

  var colorInterlaced = function (orders) {

    //隔行变色
    var $table=$('#c-r-tb');
    for(var i=0;i<= orders.length;i++){
      if( i%2 === 0) {
        $table.find('tr')[i].style.backgroundColor = "#e8edf1"
      }else{
        $table.find('tr')[i].style.backgroundColor = ""
      }
    }
  };

  $.ajax({
    url: '/getFocusList',
    type: 'get',
    dataType: 'json',
    timeout: 30000,
    success: function (res) {
      /*data: {data: data},*/
      var orders = res.orderFocusArray;

      handleFocusList(orders);
      colorInterlaced(orders);
    },
    error: function () {}
  });

  $('#c-r-tb').on('click', '.delete', function () {
    var $tr = $(this).parents('tr');
    var orderId = $(this).parents('tr').find('.order-id').html();

    if (confirm("确定要取消对该商品的关注？")) {

      $.ajax({
        url: '/orderCancelFocus',
        type: 'post',
        data: {'orderId' : orderId},
        dataType: 'json',
        success: function (resMsg) {
          if (resMsg.focusStatus) {
            $tr.remove();
          }
        }
        ,
        error: function () {}
      });
    } else {}
  });

  $('#c-r-tb').on('click', '.cart', function () {
    var $tr = $(this).parents('tr');
    var orderId = $(this).parents('tr').find('.order-id').html();

    $.ajax({
      url: '/addCartOrder',
      type: 'get',
      data: {'orderId' : orderId},
      dataType: 'json',
      success: function (resMsg) {
        if (resMsg) {
          $('.focus-warning').html('已成功添加到购物车！');
          setTimeout(function () {
            $('.focus-warning').html('');
          }, 3000)
        }
      },
      error: function () {}
    });
  });
});
