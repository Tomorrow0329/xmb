/**
 * Created by lenovo on 2016/3/26.
 */
var mongoose = require('mongoose');
Schema = mongoose.Schema;

var errMsg = '';
var userSchema = new Schema ({
    username:String,
    password:String,
    email:String
});

var orderSchema = new Schema({
    username:String,
    date:Date,
    goodsName:String,
    num:Number,
    price:Number,
    grade:String,
    tel:Number,
    email:String,
    goodsCode:String,
    classes:String,
    describe:String,
    file:String,
    imagePath:String,
    nowName:String
});

var Users = mongoose.model('users', userSchema);
var Orders = mongoose.model('orders', orderSchema);

exports.connect=function(callback){
    mongoose.connect('mongodb://localhost:27017/bsDatabase',function(err){//xmbDatabase
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
                errMsg = "username";
                callback(errMsg);
            }else{
                Users.find({email:user.email},function(err,res){
                    console.log(user.email);
                    if(err) throw err;
                    else{
                        console.log('email:'+ res);
                        if(res.length > 0){
                            errMsg = "email";//�������ѱ�ע�ᣡ
                            callback(errMsg);
                        }else{
                            console.log('create');
                            Users.create(user,function(err){
                                if(err) throw err;
                                else{
                                    errMsg = null;
                                    callback(errMsg);
                                }
                            });
                        }
                    }
                });
            }
        }
    });
};

exports.signIn = function (user, callback) {
    console.log(user);
    Users.find({username: user.username}, function (err, res) {
        if (err) throw err;
        else {
            if (res.length > 0) {
                console.log(res);
                console.log(res[0].password);
                if (user.password === res[0].password) {
                    errMsg = null;
                    callback(errMsg);
                } else {
                    errMsg = 'password';
                    callback(errMsg);
                }
            } else {
                errMsg = 'username';
                callback(errMsg);
            }
        }
    })
};

exports.initLoad = function (callback) {
  console.log('db init');
  Orders.find({}, function (err, res) {
    if (err) throw err;
    else {
      callback(res);
    }
  });
};

exports.uploadOrder = function (order,callback) {
    console.log('uploadOrder:' + order);
    Orders.create(order, function (err) {
        if (err) throw err;
        else{
            errMsg = null;
            callback(errMsg);
        }
    });
};
