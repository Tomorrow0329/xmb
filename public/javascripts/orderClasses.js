/**
 * Created by lenovo on 2016/4/27.
 */
$(document).ready(function () {
    var orderClasses = [
        {value: 0, name: '图书', child: [
            {value: 00, name: '文学名著', child: []},
            {value: 01, name: '杂志快读', child: []},
            {value: 02, name: '其他', child: []},
            {value: 03, name: '教材', child: [
                {value: 001, name: '公共课', child: []},
                {value: 002, name: '数字媒体技术', child: []},
                {value: 003, name: '汉语言文学', child: []},
                {value: 004, name: '软件工程', child: []},
                {value: 005, name: '广告学', child: []},
                {value: 006, name: '应用心理学', child: []}
            ]},
        ]},
        {value: 1, name: '服装', child: [
            {value: 10, name: '女装', child: []},
            {value: 11, name: '男装', child: []},
            {value: 12, name: '鞋靴', child: []}
        ]},
        {value: 2, name: '美食', child: [
            {value: 20, name: '周边', child: []},
            {value: 21, name: '快餐小吃', child: []},
            {value: 22, name: '自助餐', child: []},
            {value: 23, name: '日韩料理', child: []},
            {value: 24, name: '西餐', child: []},
            {value: 25, name: '地方菜', child: []},
            {value: 26, name: '其他', child: []}
        ]},
        {value: 3, name: '生活学习用品', child: []},
        {value: 4, name: '饰品礼物', child: []},
        {value: 5, name: '运动娱乐', child: []},
        {value: 6, name: '其他', child: []}
    ],
        searchStr = '<span>当前位置：</span>',
        orderClassCode = {},
        orderPosition,
        olderPosition,
        olderCode;
        codeIndex = 0;

    var codeId = window.location.pathname.split('h')[1];
    var setSearchStr = function (orderClass) {
        searchStr += '<span class="search-tips">'
        + orderClass.name +'<span style="display: none" class="tipsCode">'
        + orderClass.value +'</span></span>';

        $('.search-tip').html(searchStr + '<span class="reset">清除</span>');//×
    };
    var setTip = function (classes, code) {
        olderPosition = classes;
        olderCode = code;
        classes.forEach(function (orderClass) {
            if (orderClass.value === parseInt(code)) {
                var tipsStr = '';
                orderPosition = orderClass;
                setSearchStr(orderClass);
                orderClass.child.forEach(function (classes) {
                    tipsStr += '<span class="tips"><span class="order-name">'+ classes.name
                    +'</span><span style="display:none;" class="tipsCode">'
                    + classes.value +'</span></span>'
                });

                $('.tips-box').html(tipsStr);
            }
        });
    };
    var wordLimit = function () {
        var $describe = $("#orderClassList").find('.c-part2-detail-describe');
        var maxWidth=50;
        $describe.each(function () {
            if($(this).html().length > maxWidth){
                $(this).html($(this).html().substring(0, maxWidth));
                $(this).html($(this).html()+'...');
            }
        });
    };

    var getSearchRes = function ()  {
        /*var searchCodeId = {},
            orderCodeName = ['goodsCode', 'goodsChildCode', 'optionGardCode'];
        for (var i=0; i < orderClassCode.length; i++) {
            searchCodeId[orderCodeName[i]] = orderClassCode[i];
        }*/

        $.ajax({
            url: '/searchClass',
            type: 'post',
            data: orderClassCode,
            success: function (data) {
                var orders = data.searchOrder, list = '';

                orders.forEach(function (row) {
                    list += "<li><span class='orderId' style='display: none'>"+ row._id +"</span><img src='/uploadData/"+ row.imagePath +"' class='c-part2-new-ul-img'>" +
                    "<div class='c-part2-new-ul-img-price fr'>￥" + row.price +
                    "</div><div class='c-part2-detail'> <p class='c-part2-detail-goodsName'>" + row.goodsName +
                    "</p><p class='c-part2-detail-describe'>" + row.describe + "</p> </div> </li>";
                });
                $('#orderClassList').html(list);
                // wordLimit
                wordLimit();
            },
            error: function () {}
        })
    };
    var updateCodeList = function (id) {
        //['goodsCode', 'goodsChildCode', 'optionGardCode']
        switch (codeIndex) {
            case 0:
                orderClassCode.goodsCode = id;
                break;
            case 1:
                orderClassCode.goodsChildCode = id;
                break;
            case 2:
                orderClassCode.optionGardCode = id;
                break;
        }

        codeIndex += 1;
    };
    var init = function () {
        //orderClassCode.push(codeId);
        updateCodeList(codeId);

        // wordLimit
        wordLimit();

        switch (codeId) {
            case "0":
                setTip(orderClasses, '0');
                break;
            case "1":
                setTip(orderClasses, '1');
                break;
            case "2":
                setTip(orderClasses, '2');
                break;
            case "3":
                setTip(orderClasses, '3');
                break;
            case "4":
                setTip(orderClasses, '4');
                break;
            case "5":
                setTip(orderClasses, '5');
                break;
            case "6":
                setTip(orderClasses, '6');
                break;
        }

        $('.tips-box').on('click', '.tips', function () {
            var goodsChildCode = $($(this).find('.tipsCode')[0]).html();
            setTip(orderPosition.child, goodsChildCode);
            //orderClassCode.push(goodsChildCode);
            updateCodeList(goodsChildCode);

            getSearchRes();
        });

        $('#orderClassList').on('click', 'li', function () {
            var orderId = $(this).find('.orderId').html();

            window.location.href = "/orderDetail" + orderId;
        });

        $('.search-tip').on('click', '.reset', function () {
            //codeIndex -= 1;
            var parentVal = parseInt($($('.search-tips')[0]).find('.tipsCode').html());
            window.location.href = 'http://localhost:10011/classSearch' + parentVal;

        });

        $('.search-btn').on('click', function () {
            var searchKeyWorld = $('.search-input').val();
            if (searchKeyWorld !== '') {
                $.ajax({
                    url: '/searchKeyWorld',
                    data: {searchData: searchKeyWorld},
                    type: 'get',
                    success: function (result) {
                        if (result.data) {
                            var list = '';
                            result.data.forEach(function (row) {
                                list += "<li><span class='orderId' style='display: none'>"+ row._id +"</span><img src='/uploadData/"+ row.imagePath +"' class='c-part2-new-ul-img'>" +
                                "<div class='c-part2-new-ul-img-price fr'>￥" + row.price +
                                "</div><div class='c-part2-detail'> <p class='c-part2-detail-goodsName'>" + row.goodsName +
                                "</p><p class='c-part2-detail-describe'>" + row.describe + "</p> </div> </li>";
                            });
                            $('#orderClassList').html(list);
                            // wordLimit
                            wordLimit();
                            $('.search-tip').html('');
                            $('.tips-box').html('相关<span style="color:#ef735f">  '+ searchKeyWorld +'  </span>的搜索结果如下：');
                        }
                    },
                    error: function () {}
                });
            }
        });
    };

    init();
});