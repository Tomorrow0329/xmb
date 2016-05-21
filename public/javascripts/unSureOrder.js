/**
 * Created by lenovo on 2016/5/21.
 */
$(document).ready(function () {
    var setOrderList = function (orders) {
        var str = '';
        orders.forEach(function (order) {
            str += '<li><div class="spC-list-goods fl"> '
            +'<a "><img src="'
            +order.goodsImg+'" class="spC-list-goodsImg fl"></a> <div class="spC-list-goodsName fr">'
            +order.goodsName+'</div></div> <div class="spC-list-price fl" style="width:165px;"> <p class="spC-list-subtotal-p">'
            +order.goodsPrice +'</p></div> <div class="spC-list-number fl" style="width: 160px;"> <div class="spC-number-box"> '
            +'<p class="spC-number-span spcNumber" style="margin-left: 15px; width: 34px;">'
            +order.selectNum +'</p></div> </div> <div class="spC-list-subtotal fl" style="width: 150px;"> <p class="spC-list-subtotal-p fontWeight600 money">'
            +order.money +'</p> </div> </li>'
        });

        return str;
    };

    $.ajax({
        url: '/getUnSureOrder',
        type: 'get',
        success: function (res) {
            $('.spC-list-ul').html(setOrderList(res.unSureOrder));
        },
        error: function () {}
    });
});