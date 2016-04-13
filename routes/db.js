/**
 * Created by lenovo on 2016/3/26.
 */
var mongoose = require('mongoose');
Schema = mongoose.Schema;

var errMsg = '';
var userSchema = new Schema ({
    username:String,
    password:String,
    email:String,
    focusOrder: Array
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
                    if(err) throw err;
                    else{
                        if(res.length > 0){
                            errMsg = "email";//�������ѱ�ע�ᣡ
                            callback(errMsg);
                        }else{
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
    Users.find({username: user.username}, function (err, res) {
        if (err) throw err;
        else {
            if (res.length > 0) {
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
  Orders.find({}).sort({'date': -1}).exec(function (err, res) {
    if (err) throw err;
    else {
      callback(res);
    }
  });
};

exports.uploadOrder = function (order,callback) {
    Orders.create(order, function (err) {
        if (err) throw err;
        else{
            errMsg = null;
            callback(errMsg);
        }
    });
};

exports.getOrder = function (req, callback) {
  Orders.find({_id: req.orderId}, function (err, res) {
    if (err) throw err;
    else {
      callback(res);
    }
  })
};

exports.setFocus = function (req, callback) {
  Users.find({username: req.username}, function (err, res) {
    var focusOrder = res[0].focusOrder;
    focusOrder.push(req.orderId);

    Users.update({username: req.username}, {$set:{focusOrder: focusOrder}}, function (err, res) {
      if (err) throw err;
      else {
        callback('success');
      }
    });
  });
};

exports.cancelFocus = function (req, callback) {

  Users.find({username: req.username}, function (err, res) {
    var focusOrder = res[0].focusOrder,index = 0, orderIndex = 0;

    focusOrder.forEach(function (order) {
      if (order === req.orderId) {
        orderIndex = index;
      }
      index += 1;
    });

    focusOrder.splice(orderIndex, 1);

    Users.update({username: req.username}, {$set:{focusOrder: focusOrder}}, function (err, res) {

      if (err) throw err;
      else {
        callback('success');
      }
    });
  });
};

exports.getFocus = function (req, callback) {
  Users.find({username: req.username}, function (err, res) {

    if (err) throw err;
    else {
      callback(res[0]);
    }
  });
};

exports.getFocusList = function (req, callback) {
  req = req.split(',');
  var orderList = [], reqIndex = 0;
  (function getFocusOrder(req) {

    if (reqIndex === req.length) {
      console.log('orderList:'+ orderList);
      callback(orderList);
    }

    Orders.find({_id: req[reqIndex]}, function (err, res) {

      if (err) throw err;
      else {
        orderList.push(res[0]);
        reqIndex += 1;
        getFocusOrder(req);
      }
    })
  })(req);
};

exports.orderOnlineDB = function (req, callback) {

  Orders.find({username: req.username}, function (err, res) {

    if (err) throw err;
    else {
      callback(res);
    }
  });
};

exports.deleteOrderDB = function (req, callback) {

  Orders.remove({_id: req.orderId}, function (err, res) {
    if (err) throw  err;
    else {
      callback('success');
    }
  });
};

