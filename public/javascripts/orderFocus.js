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
        focusList += "<tr><td class='order-id' style='display: none'>"+ order._id
          +"</td><td class='c-r-td-addLength'>"+ order.goodsName
          +"</td><td>"+ order.num
          +"</td><td>"+ order.price
          +"</td><td>"+ order.grade
          +"</td><td>"+ order.username
          +"</td><td>"+ order.tel
          +"</td><td>"+ order.email
          +"<td class='c-r-td-addLength'>" + order.date.split('T')[0]+"</td></td>"
          +"<td class='edit' id='correct'>加入购物车</td><td class='edit delete'>取消关注</td></tr>"
      } else {
        /*focusList += "<tr><td class='c-r-td-addLength'>商品已下架"
          +"</td><td>－－"
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
    data: {data: data},
    dataType: 'json',
    timeout: 30000,
    success: function (res) {
      var orders = res.orderFocusArray;

      handleFocusList(orders);
      colorInterlaced(orders);
    },
    error: function () {}
  });

  $('#c-r-tb').on('click', '.delete', function () {
    var $tr = $(this).parents('tr');
    var orderId = $(this).parents('tr').find('.order-id').html();

    $.ajax({
      url: '/orderCancelFocus',
      type: 'post',
      data: {'orderId' : orderId},
      dataType: 'json',
      success: function (resMsg) {
        if (!resMsg) {
          $tr.remove();
        }
      }
      ,
      error: function () {}
    });
  });
});
