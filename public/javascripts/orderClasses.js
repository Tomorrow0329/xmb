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
    var orderList = [], sortNewList = [];
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
    var initSortBox = function () {
        $('.sort-box').children('.sort-tip').removeClass('active');
        $('.sort-box').children('.sort-tip:first').addClass('active');
    };

    var setOrderClassList = function (orders) {
        var list = '';
        orders.forEach(function (row) {
            var focusStr = '', outNumStr = '';
            if (row.focus) {
                focusStr += '<p class="focus-box"> <img src="/images/icon-focus.jpg" class="icon-focus"> ' +
                '<span>'+row.focus+'</span> </p>'
            }

            if (row.outNum) {
                outNumStr += '<p class="outNum-box">已售出：<span class="out-num">'+
                row.outNum+'</span> </p>'
            }
            list += "<li><span class='orderId' style='display: none'>"+ row._id +"</span><img src='/uploadData/"+ row.imagePath +"' class='c-part2-new-ul-img'>" +
            "<div class='c-part2-new-ul-img-price fr'>￥" + row.price +
            "</div><div class='c-part2-detail'> <p class='c-part2-detail-goodsName'>" + row.goodsName +
            "</p><p class='c-part2-detail-describe'>" + row.describe + "</p> </div> "+
            focusStr + outNumStr +"</li>";
        });
        $('#orderClassList').html(list);
        wordLimit();
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
                var orders = data.searchOrder;

                orderList = orders;
                setOrderClassList(orders);

                initSortBox();
                /*orders.forEach(function (row) {
                    list += "<li><span class='orderId' style='display: none'>"+ row._id +"</span><img src='/uploadData/"+ row.imagePath +"' class='c-part2-new-ul-img'>" +
                    "<div class='c-part2-new-ul-img-price fr'>￥" + row.price +
                    "</div><div class='c-part2-detail'> <p class='c-part2-detail-goodsName'>" + row.goodsName +
                    "</p><p class='c-part2-detail-describe'>" + row.describe + "</p> </div> </li>";
                });
                $('#orderClassList').html(list);*/
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

    //冒泡排序（从大到小）
    var sort = function(elements){
        for(var i = 0; i < elements.length-1; i++){
            for(var j = 0; j < elements.length-i-1; j++){
                if(elements[j] > elements[j+1]){
                    var swap=elements[j];
                    elements[j]=elements[j+1];
                    elements[j+1]=swap;
                }
            }
        }
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

        var parentVal = parseInt($($('.search-tips')[0]).find('.tipsCode').html());
        /*window.location.href = 'http://localhost:10011/classSearch' + parentVal;*/
        $.ajax({
            async: false,
            url: '/classSearch' +parentVal,
            type: 'post',
            success: function (res) {
                orderList = res.orders;
                sortNewList = res.orders;
            },
            error: function () {}
        });

        $('.sort-new').on('click', function () {
            $(this).parents('.sort-box').children('.sort-tip').removeClass('active');
            $(this).addClass('active');

            setOrderClassList(sortNewList);
        });

        $('.sort-focusLevel').on('click', function () {

                $(this).parents('.sort-box').children('.sort-tip').removeClass('active');
                $(this).addClass('active');

                var sortFocusList = orderList;
                for(var i = 0; i < sortFocusList.length-1; i++){
                    for(var j = 0; j < sortFocusList.length-i-1; j++){
                        if (!sortFocusList[j].focus) {
                            sortFocusList[j].focus = 0;
                        }
                        if (!sortFocusList[j+1].focus) {
                            sortFocusList[j+1].focus = 0;
                        }
                        if(sortFocusList[j].focus < sortFocusList[j+1].focus){
                            var swap = sortFocusList[j];
                            sortFocusList[j] = sortFocusList[j+1];
                            sortFocusList[j+1] = swap;
                        }
                    }
                }

            setOrderClassList(sortFocusList);
        });

        $('.sort-priceUp').on('click', function () {
            $(this).parents('.sort-box').children('.sort-tip').removeClass('active');
            $(this).addClass('active');

            var sortPriceUpList = orderList;
            for(var i = 0; i < sortPriceUpList.length-1; i++){
                for(var j = 0; j < sortPriceUpList.length-i-1; j++){
                    if (!sortPriceUpList[j].price) {
                        sortPriceUpList[j].price = 0;
                    }
                    if (!sortPriceUpList[j+1].price) {
                        sortPriceUpList[j+1].price = 0;
                    }
                    if(sortPriceUpList[j].price > sortPriceUpList[j+1].price){
                        var swap = sortPriceUpList[j];
                        sortPriceUpList[j] = sortPriceUpList[j+1];
                        sortPriceUpList[j+1] = swap;
                    }
                }
            }

            setOrderClassList(sortPriceUpList);
        });

        $('.sort-priceDown').on('click', function () {
            $(this).parents('.sort-box').children('.sort-tip').removeClass('active');
            $(this).addClass('active');

            var sortPriceDownList = orderList;
            for(var i = 0; i < sortPriceDownList.length-1; i++){
                for(var j = 0; j < sortPriceDownList.length-i-1; j++){
                    if (!sortPriceDownList[j].price) {
                        sortPriceDownList[j].price = 0;
                    }
                    if (!sortPriceDownList[j+1].price) {
                        sortPriceDownList[j+1].price = 0;
                    }
                    if(sortPriceDownList[j].price < sortPriceDownList[j+1].price){
                        var swap = sortPriceDownList[j];
                        sortPriceDownList[j] = sortPriceDownList[j+1];
                        sortPriceDownList[j+1] = swap;
                    }
                }
            }

            setOrderClassList(sortPriceDownList);
        });

        $('.sort-outNum').on('click', function () {
            $(this).parents('.sort-box').children('.sort-tip').removeClass('active');
            $(this).addClass('active');

            var sortOutNumList = orderList;
            for(var i = 0; i < sortOutNumList.length-1; i++){
                for(var j = 0; j < sortOutNumList.length-i-1; j++){
                    if (!sortOutNumList[j].outNum) {
                        sortOutNumList[j].outNum = 0;
                    }
                    if (!sortOutNumList[j+1].outNum) {
                        sortOutNumList[j+1].outNum = 0;
                    }
                    if(sortOutNumList[j].outNum < sortOutNumList[j+1].outNum){
                        var swap = sortOutNumList[j];
                        sortOutNumList[j] = sortOutNumList[j+1];
                        sortOutNumList[j+1] = swap;
                    }
                }
            }

            setOrderClassList(sortOutNumList);
        });

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

        var pathname = window.location.pathname;
        var encodePathname = pathname.split('/')[2];
        var searchKeyWorld = decodeURI(encodePathname);
        if (searchKeyWorld !== 'undefined' && searchKeyWorld !== '') {
            $.ajax({
                url: '/searchKeyWorld',
                data: {searchData: searchKeyWorld},
                type: 'get',
                success: function (result) {
                    if (result.data) {
                        var list = '';
                        orderList = result.data;
                        result.data.forEach(function (row) {
                            var focusStr = '', outNumStr = '';
                            if (row.focus) {
                                focusStr += '<p class="focus-box"> <img src="/images/icon-focus.jpg" class="icon-focus"> ' +
                                '<span>'+row.focus+'</span> </p>'
                            }

                            if (row.outNum) {
                                outNumStr += '<p class="outNum-box">已售出：<span class="out-num">'+
                                row.outNum+'</span> </p>'
                            }
                            list += "<li><span class='orderId' style='display: none'>"+ row._id +"</span><img src='/uploadData/"+ row.imagePath +"' class='c-part2-new-ul-img'>" +
                            "<div class='c-part2-new-ul-img-price fr'>￥" + row.price +
                            "</div><div class='c-part2-detail'> <p class='c-part2-detail-goodsName'>" + row.goodsName +
                            "</p><p class='c-part2-detail-describe'>" + row.describe + "</p> </div> "+
                            focusStr + outNumStr +"</li>";
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
    };

    init();
});