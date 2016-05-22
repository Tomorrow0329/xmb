/**
 * Created by lenovo on 2016/5/22.
 */
$(document).ready(function () {

    var handelMyOrders = function (rows) {
        var str = '<h1 class="c-r-h1">我的订单</h1>';
        rows.forEach(function (row) {
            var rowspanLength = row.payOrders.length;
            var totalStr = '';
            totalStr += '<td rowspan="'+
            rowspanLength +'">'+row.totalMoney+'元</td> <td rowspan="'+
            rowspanLength +'">'+ row.payWay +'</td> <td rowspan="'+
            rowspanLength +'"><p style="padding-bottom: 10px;">'+
            row.receipt.name+'</p><p style="padding-bottom: 10px;">'+
            row.receipt.tel+'</p><p style="padding-bottom: 10px;">'+
            row.receipt.address+'</p></td>';

            str += '<table id="c-r-tb" class="my-order-table"> <thead> <tr class="c-r-table my-order-thead"> ' +
            '<th class="c-r-td-addLength my-order-thead-th">商 品</th> <th class="my-order-thead-th">名 称</th>' +
            '<th class="my-order-thead-th">单 价</th> <th class="my-order-thead-th">数 量</th> ' +
            '<th class="my-order-thead-th">评 价</th>' +
            '<th class="my-order-thead-th">总 价</th> <th class="my-order-thead-th">付款方式</th> ' +
            '<th class="my-order-thead-th">收货信息</th> </tr> </thead> ' +
            '<tbody>';

            var payOrder = [];
            payOrder = row.payOrders;
            for (var i = 0; i < payOrder.length; i++) {
                if (i===0) {
                    str += ' <tr class="my-order-tr"> ' +
                    '<td> <img class="order-img" src="'+payOrder[i].goodsImg+'"> </td> ' +
                    '<td><p class="order-name">'+payOrder[i].goodsName+'</p></td> ' +
                    '<td>'+payOrder[i].goodsPrice+'</td> <td>'+payOrder[i].selectNum+'</td>' +
                    '<td class="toComment">去评价<span class="goodsId" style="display:none;">'+
                    payOrder[i].goodsId+'</span></td> ';

                    str += totalStr + '</tr>';
                } else {
                    str += ' <tr class="my-order-tr"> ' +
                    '<td> <img class="order-img" src="'+payOrder[i].goodsImg+'"> </td> ' +
                    '<td><p class="order-name">'+payOrder[i].goodsName+'</p></td> ' +
                    '<td>'+payOrder[i].goodsPrice+'</td> <td>'+payOrder[i].selectNum+'</td>' +
                    '<td class="toComment">去评价<span class="goodsId" style="display:none;">'+
                    payOrder[i].goodsId+'</span></td> ';
                    /*'<tr class="my-order-tr"> ' +
                     '<td> <img class="order-img" src="/images/cloth1.jpg"> </td> <td><p class="order-name">日系衬衫</p></td> ' +
                     '<td>99</td> <td>1</td> </tr> <tr class="my-order-tr"> <td> <img class="order-img" src="/images/cloth1.jpg"> ' +
                     '</td> <td><p class="order-name">日系衬衫</p></td> <td>99</td> <td>1</td> </tr> <tr class="my-order-tr"> ' +
                     '<td> <img class="order-img" src="/images/cloth1.jpg"> </td> <td><p class="order-name">日系衬衫</p></td> ' +
                     '<td>99</td> <td>1</td> </tr> </tbody> </table>'*/
                }
            }

            str += '</tbody> </table>';
        });

        return str;
    };

    $.ajax({
        url: '/getMyOrders',
        type: 'get',
        success: function (res) {
            var data = res;
            $('.c-right').html(handelMyOrders(res.rows));
        },
        error: function () {}
    });

    $('.layer-close').click(function(){
        $('.layer-box').fadeOut(200);
    });
    var toCommentObj;
    $('.c-right').on('click', '.toComment', function () {
        toCommentObj = $(this);
        var goodsId = $(this).find('.goodsId').html();
        $('.layer-order').html(goodsId);
        $('.layer-box').fadeIn(200);
    });

    $('#cmt-btn').on('click', function () {
        var comment = $('.cmt-write').val();
        var goodsId = $('.layer-order').html();
        if (comment == '') {
            return false;
        }

        $.ajax({
            url: '/setOrderComment',
            data: {goodsId: goodsId, commentTxt: comment},
            dataType: 'json',
            type: 'get',
            success: function (res) {
                var data = res;
                toCommentObj.find('.goodsId').html('已评价');
                $('.cmt-write').val('');
                $('.layer-box').fadeOut(200);

            },
            error: function () {}
        });
    });
});
