/**
 * Created by lenovo on 2016/5/23.
 */
$(document).ready(function () {
    var receiptList = [];
    $.ajax({
        url: '/getCenterMsg',
        type: 'get',
        dataType: 'json',
        success: function (res) {
            var users = res.users, str = '', indexCode = 0;
            receiptList = users.receiptAddress;
            $('#nickname_span').html(users.username);
            $('.user-email').html(users.email);
            $('.user-password').html(users.password);
            $('.tel').html(users.tel);

            $('#phone').val(users.tel);
            $('#mail').val(users.email);
            $('#password').val(users.password);

            users.receiptAddress.forEach(function (address) {
                str += '<div id="gain" style="margin-left: 25px;"><p class="userList receipt-box"> <span class="userName ">'+
                address.name+'</span> <span class="userDress ">'+
                address.address+'</span> <span class="userTel">Tel:'+
                address.tel+'</span> <span class="removeReceipt">删 除' +
                '<span class="code" style="display: none;">'+indexCode+'</span></span></p><br></div>';

                indexCode += 1;
            });

            $('.receipt').html(str);
        },
        error: function () {}
    });

    $('#save_info').on('click', function () {
        var email = $('#mail').val(),
            password = $('#password').val(),
            tel = $('#phone').val();

        $.ajax({
            url: '/setUserMsg',
            data: {email: email, password: password, tel: tel},
            type: 'post',
            dataType: 'json',
            success: function (res) {
                var data = res;

                $('.user-email').html(email);
                $('.user-password').html(password);
                $('.tel').html(tel);

                $("#save_info").css({
                    display: "none"
                });
                $("#edit_info").css({
                    display: "block"
                });
                $(".right_info input").css({
                    display: "none"
                });
                $(".right_info span").css({
                    display: "inline"
                });

            },
            error: function () {}
        });
    });

    $('.receipt').on('click', '.removeReceipt', function () {
        var i = parseInt($(this).find('.code').html()),
            newReceiptList = [];
        for (var j = 0; j<receiptList.length; j++) {
            if (j !== i) {
                newReceiptList.push(receiptList[j]);
            }
        }

        if (confirm("删除后可在订单页新增信息，确定要删除该信息？")) {
            $.ajax({
                url: '/updateReceipt',
                data: {receipt: JSON.stringify(newReceiptList)},
                type: 'post',
                dataType: 'json',
                success: function (res) {
                    $(this).parents('#gain').remove();
                }.bind($(this)),
                error: function () {}
            });
        } else {}
    });
});
