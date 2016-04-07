/**
 * Created by lenovo on 2016/4/4.
 */
$(document).ready(function () {

    /*$('.uploadOrder').on('click', function (e) {
        e.preventDefault();
        var errMsg = '',
            order = new Object();
        $('#warning').text('');
        order = {
            goodsName: $('#goodsName').val(),
            num: $('#num').val(),
            price: $('#price').val(),
            grade: $('#grade').val(),
            tel: $('#tel').val(),
            email: $('#email').val(),
            date: $('#date').val(),
            goodsCode: $('#goodsCode').val(),
            classes: $('#classes').val()
        };
        if(order.goodsName =="" || order.num=="" || order.price=="" ||
            order.grade=="" || order.tel=="" || order.goodsCode=="" ||
            order.classes=="" || order.date=="" || order.email==""){
            errMsg = '������������Ϣ��';
        } else {
            $.ajax({
                url: '/upload',
                type: 'post',
                dataType: 'json',
                data: order,
                timeout: 30000,
                success: function (res) {
                    var data = res;
                },
                error: function () {}
            });
        }

        $('#warning').text(errMsg);
    });*/
});
