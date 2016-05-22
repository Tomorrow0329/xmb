/**
 * Created by lenovo on 2016/5/21.
 */
$(document).ready(function () {
    var setOrderList = function (orders) {
        var str = '';
        orders.forEach(function (order) {
            str += '<li><div class="spC-list-goods fl"><span style="display: none;" class="goodsId">'+
            order.goodsId +'</span> '
            +'<a "><img src="'
            +order.goodsImg+'" class="spC-list-goodsImg fl"></a> <div class="spC-list-goodsName fr">'
            +order.goodsName+'</div></div> <div class="spC-list-price fl" style="width:100px;"> <p class="spC-list-subtotal-p">'
            +order.goodsPrice +'</p></div> <div class="spC-list-number fl" style="width: 120px;"> <div class="spC-number-box"> '
            +'<p class="spC-number-span spcNumber" style="margin-left: 15px; width: 34px;">'
            +order.selectNum +'</p></div> </div> <div class="spC-list-subtotal fl" style="width: 120px;"> <p class="spC-list-subtotal-p fontWeight600 money">'
            +order.money +'</p> </div><div class="spC-list-subtotal fl" style="width: 100px;"> <p class="spC-list-subtotal-p fontWeight600 sureBtn toSureOrder">'
            +'确认订单' +'</p> </div><div class="spC-list-subtotal fl" style="width: 100px;"> <p class="spC-list-subtotal-p fontWeight600 sureBtn removeSureOrder" >'
            +'移除订单' +'</p> </div> </li>'
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

    $('.spC-list-ul').on('click', '.removeSureOrder', function () {
        var goodsId = $(this).parents('li').find('.goodsId').html();

        $.ajax({
            url: '/removeSureOrder',
            data: {goodsId: goodsId},
            type: 'get',
            dataType: 'json',
            success: function (res) {
                var data = res;
                $(this).parents('li').remove();
            }.bind($(this)),
            error: function () {}
        });
    });

    $('.spC-list-ul').on('click', '.toSureOrder', function () {
        var goodsId = $(this).parents('li').find('.goodsId').html();

        $.ajax({
            url: '/toSurePayOrder',
            data: {goodsId: goodsId},
            type: 'get',
            dataType: 'json',
            success: function (res) {
                var data = res;
                $(this).parents('li').remove();
                window.location.href = '/payFor';
            }.bind($(this)),
            error: function () {}
        });
    });
});