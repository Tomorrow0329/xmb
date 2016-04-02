/**
 * Created by lenovo on 2016/3/26.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema ({
    id : Number,
    userName : String,
    passWorld : String,
    email : String
});

var Users = mongoose.model('users', userSchema);

exports.connect=function(callback){
    mongoose.connect('mongodb://localhost:27017/bsDatabase',function(err){
        if(err) throw(err);
        else callback();
    });
};

exports.disconnect = function(){
    mongoose.disconnect();
};

exports.cls = function(){
    mongoose.connection.close(function(){
        console.log('connection close');
    });
};

exports.signUp = function(user,callback){
    Users.find({username:user.username},function(err,res){
        if(err) throw err;
        else{
            if(res.length > 0){
                //exports.warn = "���û����ѱ�ʹ��";
                return {errMsg: '���û����ѱ�ʹ��'};
            }else{
                Users.find({emil:user.emil},function(err,res){
                    if(err) throw err;
                    else{
                        if(res.length > 0){
                            exports.emil = "�������ѱ�ע�ᣡ";
                            callback();
                            return {errMsg: '�������ѱ�ע��!'}
                        }else{
                            Users.create(user,function(err){
                                if(err) throw err;
                                else{
                                    var warn = "";
                                    callback(warn);
                                }
                            });
                        }
                    }
                });
            }
        }
    });
};
