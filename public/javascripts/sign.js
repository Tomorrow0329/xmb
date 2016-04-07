/**
 * Created by lenovo on 2015/4/25.
 */
//sign up

$(document).ready(function () {
    var $warning = $('#warning'),
        jumpPages = {
            signIn: "http://localhost:10011/signIn",
            index: "http://localhost:10011/index"

        };
    var sign = {
        signUp : function (user) {
            $.ajax({
                type: 'post',
                url : '/signUp',
                data: user,
                dataType: 'json',
                success: function (data) {
                    if (data.errMsg) {
                        var errorWarn = '';
                        switch (data.errMsg) {
                            case 'username':
                                errorWarn ='该用户名已被使用！';
                                break;
                            case 'email':
                                errorWarn ='该邮箱已被注册!';
                                break;
                            default:
                                break;
                        }
                    } else {
                        $warning.text('');
                        window.location.href = jumpPages.signIn;
                    }

                    $('#warning').text(errorWarn);
                },
                error : function (error) {
                    console.log(error)
                }
            });
        },
        signIn : function (user) {
            $.ajax({
                type: 'post',
                url : '/signIn',
                data: user,
                dataType: 'json',
                timeout: 30000,
                success: function (data) {
                    if (data.errMsg) {
                        var errorWarn = '';
                        switch (data.errMsg) {
                            case 'username':
                                errorWarn= '用户名错误！';
                                break;
                            case 'password':
                                errorWarn = '密码错误！';
                                break;
                            default:
                                break;
                        }
                    } else {
                        $('#warning').text('');
                        window.location.href = jumpPages.index;
                    }
                    $('#warning').text(errorWarn);
                },
                error: function () {}
            });
        }
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
                    sign.signUp(user);
                }
            }
        }
    });

//Sign in

    $('.signIn').on('click', function (e) {
        e.preventDefault();
        var user = {
            username : $('#username').val(),
            password : $('#password').val()
        };
        if(user.username ==="" || user.password ===""){
            $warning.text('请填入完整的登陆信息!');
        }

        sign.signIn(user);
    });
});