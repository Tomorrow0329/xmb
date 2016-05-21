/**
 * Created by lenovo on 2015/6/9.
 */
$(document).ready(function(){

    var payOrders = [];
    $('.add-address').click(function(){
        $('.layer-box').fadeIn(200);
    });
    $('.layer-close').click(function(){
        $('.layer-box').fadeOut(200);
    });


    /*var userList = $('.userList');
    for(var j=0;j<userList.length;j++){
        $(userList[j]).on('click',function(){
            userList.css('background','white').find('.userName').css({'color':'#01a57f','border':'1px solid #01a57f'});
            $(this).css('background','#e8edf1').find('.userName').css({'color':' #ef735f','border':'1px solid  #ef735f'});
        })
    }*/

    $('#gaininfo').on('click', '.userList', function () {
        $('.userList').css('background','white').removeClass('choose').find('.userName').css({'color':'#01a57f','border':'1px solid #01a57f'});
        $(this).css('background','#e8edf1').addClass('choose').find('.userName').css({'color':' #ef735f','border':'1px solid  #ef735f'});
    });


    var weySpan = $('.wey-inner > span');
    for(var i= 0;i<weySpan.length;i++){
        $(weySpan[i]).on('click',function(){
            weySpan.removeClass('chooseWay').css({'color':'#01a57f','border':'1px solid #01a57f','background':'white'});
            $(this).addClass('chooseWay').css({'color':' #ef735f','border':'1px solid  #ef735f','background':'#e8edf1'});
        });
    }

    // ajax 保存 收货人地址
    $("#firstsubmit").click(function(event) {
        var name = $("#gname").val();
        /*var provice = $("#provice").val();
        var city = $("#city").val();
        var country = $("#country").val();*/
        var address = $("#user-address").val();
        var phone = $("#user-phone").val();
        if (name == ''  || address == '' || phone == '' ){//|| provice == '' || city == ''
            return false;
        }
        $.ajax({
            url: '/setReceiptAddress',
            data: {name:name,address:address,phone:phone},
            type: 'post',
            dataType: 'json',
            success: function (res) {
                var data = res.address;
                var str = '';
                str += '<div id="gain"><p class="userList"> <span class="userName ">'+
                data.name+'</span> <span class="userDress ">'+
                data.address+'</span> <span class="userTel">Tel:'+
                data.tel+'</span> </p><br></div>';
                $("#gaininfo").html(str);
                $('.layer-box').fadeOut(200);
            },
            error: function () {}
        });
/*
        $.post('/setReceiptAddress', {name:name,provice:provice,city:city,country:country,address:address,phone:phone}, function(msg) {
            if(!msg.status){
                alert(msg.info);
            }else{
                var data = msg.data;
                var res = '<div id="gain">';
                for(var i=0;i<data.length;i++){
                    res += '收货人为'+data[i].gname+' <p class="userList"> <span class="userName ">'+data[i].gname+'</span> <span class="userDress ">'+data[i].prov+' '+data[i].city+' '+data[i].country+' '+data[i].address+'</span> <span class="userTel">Tel:'+data[i].phone+'</span></p><br />';
                }
                res += '</div>';
                $("#gaininfo").html(res);
                $('.layer-box').fadeOut(200);
            }
        },'json');
*/
    });

    $('#addSubmit').click(function (event) {
        var name = $("#goodesName").val();
        /*var provice = $("#provice").val();
         var city = $("#city").val();
         var country = $("#country").val();*/
        var address = $("#userAddress").val();
        var phone = $("#userPhone").val();
        if (name == ''  || address == '' || phone == '' ){//|| provice == '' || city == ''
            return false;
        }
        $.ajax({
            url: '/setReceiptAddress',
            data: {name:name,address:address,phone:phone},
            type: 'post',
            dataType: 'json',
            success: function (res) {
                var str = '<div id="gain">';
                str += $('#gain').html();
                str += '<p class="userList"> <span class="userName ">'+
                res.address.name+'</span> <span class="userDress ">'+
                res.address.address+'</span> <span class="userTel">Tel:'+
                res.address.tel+'</span> </p><br></div>';
                $("#gaininfo").html(str);
                $('.layer-box').fadeOut(200);
            },
            error: function () {}
        });
    });

    var setOrderList = function (orders) {
        payOrders = orders;
        var str = '';
        orders.forEach(function (order) {
            str += '<li><div class="spC-list-goods fl" style="width:447px;"> <span class="goodsId" style="display:none;">'
            +order.goodsId+'</span>'
            +'<a "><img src="'
            +order.goodsImg+'" class="spC-list-goodsImg fl"></a> <div class="spC-list-goodsName fr">'
            +order.goodsName+'</div></div> <div class="spC-list-price fl" style="width:165px;"> <p class="spC-list-subtotal-p">'
            +order.goodsPrice +'</p></div> <div class="spC-list-number fl" style="width: 180px;"> <div class="spC-number-box"> '
            +'<p class="spC-number-span spcNumber" style="margin-left: 15px; width: 34px;">'
            +order.selectNum +'</p></div> </div> <div class="spC-list-subtotal fl" style="width: 150px;"> <p class="spC-list-subtotal-p fontWeight600 money">'
            +order.money +'</p> </div> </li>'
        });

        return str;
    };

    var countTotalMoney = function () {
        var orderMoneyList = $('.spC-list-ul').find('.money'),
            totalMoney = 0;

        for (var i= 0; i < orderMoneyList.length; i++) {
            totalMoney += parseFloat($(orderMoneyList[i]).html());
        }

        return totalMoney;
    };

    $.ajax({
        url: '/getPayOrder',
        type: 'get',
        success: function (res) {
            if (res.address.length !== 0) {
                $('.add-receipt').hide();
                $('#gain').show();
                $('.add-address').show();

                var str = '<div id="gain">';
                res.address.forEach(function (res) {
                    str += '<p class="userList"> <span class="userName ">'+
                    res.name+'</span> <span class="userDress ">'+
                    res.address+'</span> <span class="userTel">Tel:'+
                    res.tel+'</span> </p><br>'
                });

                /*$('#gain').html(str);*/
                $("#gaininfo").html(str);
            } else {
                $('.add-receipt').show();
                $('#gain').hide();
                $('.add-address').hide();
            }

            $('.spC-list-ul').html(setOrderList(res.payOrder));
            $('.PriceNum').html(countTotalMoney());
        },
        error: function () {}
    });


    //提交订单
    $('.toPay').on('click', function () {
        var receiptName = $('.choose').find('.userName').html();
        var receiptAddress = $('.choose').find('.userDress ').html();
        var receiptTel = $('.choose').find('.userTel').html();
        var receipt = {
            name: receiptName,
            address: receiptAddress,
            tel: receiptTel
        };

        var payWay = $('.chooseWay').html();

        if (payOrders && receiptName && receiptAddress && receiptTel && payWay ) {
            $.ajax({
                url: '/toSureOrder',
                type: 'post',
                data: {receipt: JSON.stringify(receipt), payWay: payWay, payOrders: JSON.stringify(payOrders)},
                dataType: 'json',
                success: function (res) {
                    var data = res;
                },
                error: function () {}
            });
        }
    });

});