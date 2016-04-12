/**
 * Created by 111 on 16/4/12.
 */
$(document).ready(function () {
  var data = $('.orderData').html().toString();
  //data = data.split(',');

  $.ajax({
    url: '/getFocusList',
    type: 'get',
    data: {data: data},
    dataType: 'json',
    timeout: 30000,
    success: function (res) {
      var orders = res.orderFocusArray,
        focusList = '';
      orders.forEach(function (order) {
        focusList += "<tr><td class='c-r-td-addLength'>"+ order.goodsName
          +"</td><td>"+ order.num
          +"</td><td>"+ order.price
          +"</td><td>"+ order.grade
          +"</td><td>"+ order.username
          +"</td><td>"+ order.tel
          +"</td><td>"+ order.email
          +"<td class='c-r-td-addLength'>" + order.date.split('T')[0]+"</td></td>"
          +"<td class='edit' id='correct'>加入购物车</td><td class='edit' id='delete'>删除</td></tr>"
      });
      $('#c-r-tb > tbody').html(focusList);

      //隔行变色
      var $table=$('#c-r-tb');
      for(var i=0;i<= orders.length;i++){
        if( i%2 === 0) {
          $table.find('tr')[i].style.backgroundColor = "#e8edf1"
        }else{
          $table.find('tr')[i].style.backgroundColor = ""
        }
      }
    },
    error: function () {}
  });
});
