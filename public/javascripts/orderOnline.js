/**
 * Created by 111 on 16/4/12.
 */
$(document).ready(function () {
  $('.delete').on('click', function () {
    var orderId = $(this).parents('tr').find('.order-id').html();

    $.ajax({
      url: '/deleteOrder',
      type: 'post',
      data: {'orderId' : orderId},
      dataType: 'json',
      success: function (resMsg) {
        var res = resMsg;
      }
      ,
      error: function () {}
    });
  });
});
