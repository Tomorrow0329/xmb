/**
 * Created by lenovo on 2015/4/25.
 */
//sign up

$(document).ready(function () {
    var $warning = $('#warning');
    var signUp = function (user) {
        $.ajax({
            type: 'post',
            url : '/signUp',
            data: user,
            dataType: 'json',
            success: function (data) {
                var res = data;
                console.log(data);
            },
            error : function (error) {
                console.log(error)
            }
        });
    };

    $('.signUp').on('click', function (e) {
        e.preventDefault();
        var user=new Object();
        user.username = $('#username').val();
        user.password = $('#password').val();
        user.pswSure = $('#pswSure').val();
        user.email = $('#email').val();
        if(user.username==""|| user.password==""|| user.pswSure==""){
            $warning.text('请填入完整注册信息!');
            //e.preventDefault();
        }else{
            if(user.password != user.pswSure){
                $warning.text('密码确认与您设置的密码不符！');
                $('#password').val('');
                $('#pswSure').val('');
                //e.preventDefault();
            }else{
                var apos=user.email.indexOf("@");
                var dotpos=user.email.lastIndexOf(".");
                if (apos<1||dotpos-apos<2)
                {
                    $warning.text('邮箱格式不正确');
                    //e.preventDefault();
                } else {
                    signUp(user);
                }
            }
        }
    });


//Sign in


    $('.signIn').on('click', function () {
        var username = document.getElementById('username');
        var password = document.getElementById('password');
        if(username.value=="" || password.value==""){
            document.getElementById('warning').innerHTML = "请填入完整的登陆信息" ;
            if(event && event.preventDefault){
                event.preventDefault();
            }else{

            }
        }
    });
});