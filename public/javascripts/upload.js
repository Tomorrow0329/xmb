/**
 * Created by lenovo on 2016/4/4.
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
        optionList = '<option value="-1">--请选择--</option>',
        $orderClass = $('.orderClass'),
        $orderClassChild = $('.orderClassChild'),
        $optionGard = $('.optionGard'),
        orderChildClasses = [];
    orderClasses.forEach(function (orderClass) {
        optionList += "<option value='" + orderClass.value + "'>" + orderClass.name + "</option>";
    });
    $orderClass.html(optionList);
    $orderClass.on('change', function () {
        var parentValue = $orderClass[0].value,
            optionChildList = '';
        orderClasses.forEach(function (orderClass) {
            if (orderClass.value === parseInt(parentValue)) {
                $orderClassChild.show();
                orderChildClasses = orderClass.child;
                orderChildClasses.forEach(function (orderChild) {
                    optionChildList += "<option value='" + orderChild.value + "'>" + orderChild.name + "</option>";
                });
            }
        });

        $orderClassChild.html(optionChildList);
    });

    $orderClassChild.on('change', function () {
        var parentValue = $orderClassChild[0].value,
            optionChildList = '';
        if (parentValue == '3') {
            $('.optionGard').show();
            orderClasses[0].child[3].child.forEach(function (orderChild) {
                optionChildList += "<option value='" + orderChild.value + "'>" + orderChild.name + "</option>";
            });
        } else {
            $('.optionGard').hide();
        }

        $('.optionGard').html(optionChildList);
    });
});
