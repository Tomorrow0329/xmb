/**
 * Created by lenovo on 2016/3/26.
 */
var mongoose = require('mongoose');
Schema = mongoose.Schema;
var userSchema = new Schema ({
    username:String,
    password:String,
    email:String,
    tel: String,
    focusOrder: Array,
    cartOrder: Array,
    payOrders: Array,
    thisPayOrders: Array,
    receiptAddress: Array,
    myOrders: Array
});
var orderSchema = new Schema({
    username:String,
    date:Date,
    goodsName:String,
    num:Number,
    outNum: Number,
    price:Number,
    tel:Number,
    email:String,
    goodsCode:String,
    goodsChildCode: String,
    optionGardCode: String,
    classes:String,
    describe:String,
    file:String,
    imagePath:String,
    nowName:String,
    comments: Array,
    focus: Number
});
var errMsg = '';

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
          Orders.find({_id: req.orderId}, function (err, res) {
              if (err) throw err;
              else {
                  var focusCode = 0;
                  if (res[0].focus) {
                      focusCode = res[0].focus;
                      focusCode += 1;
                  } else {
                      focusCode = 1;
                  }

                  Orders.update({_id: req.orderId}, {$set: {focus: focusCode}}, function (err, res) {
                      if (err) throw err;
                      else {
                          callback('success');
                      }
                  });
              }
          });
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

    Users.update({username: req.username}, {$set:{focusOrder: focusOrder}}, function (err, res)  {

      if (err) throw err;
      else {
          Orders.find({_id: req.orderId}, function (err, res) {
              if (err) throw err;
              else {
                  var focusCode = 0;
                  if (res[0].focus && res[0].focus > 0) {
                      focusCode = res[0].focus;
                      focusCode -= 1;
                  } else {
                      focusCode = 0;
                  }

                  Orders.update({_id: req.orderId}, {$set: {focus: focusCode}}, function (err, res) {
                      if (err) throw err;
                      else {
                          callback('success');
                      }
                  });
              }
          });
      }
    });
  });
};

exports.getFocus = function (req, callback) {
  Users.find({username: req.username}, function (err, res) {

    if (err) throw err;
    else {
        var orders = res[0].focusOrder, orderList = [], reqIndex = 0;
        orders.forEach(function (order) {
            Orders.find({_id: order}, function (err, res) {

                if (err) throw err;
                else {
                    if (res[0]) {
                        orderList.push(res[0]);
                    }

                    reqIndex += 1;

                    if (reqIndex == orders.length) {
                        callback(orderList);
                    }
                }
            });
        });
    }
  });
};

exports.getFocusList = function (req, callback) {
  /*req = req.split(',');
  var orderList = [], reqIndex = 0;
  (function getFocusOrder(req) {

    if (reqIndex === req.length) {
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
  })(req);*/
    Users.find({username: req.username}, function (err, res) {
         if (err) throw err;
        else {
             var orders = res[0].focusOrder, orderList = [], reqIndex = 0;
             orders.forEach(function (order) {
                 Orders.find({_id: order}, function (err, res) {

                     if (err) throw err;
                     else {
                         orderList.push(res[0]);

                         reqIndex += 1;

                         if (reqIndex == orders.length) {
                             callback(orderList);
                         }
                     }
                 });
             });
         }
    });
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

exports.classSearchDB = function (req, callback) {
    Orders.find({goodsCode: req.goodsCode}, function (err, res) {
        if (err) throw err;
        else {
            callback(res);
        }
    });
};

exports.searchClassDB = function (req, callback) {
    Orders.find(req, function (err, res) {
        if (err) throw err;
        else {
            callback(res);
        }
    })
};

exports.correctOrderDB = function (req, callback) {
    Orders.find({_id: req.id}, function (err, res) {
        if (err) throw err;
        else {
            callback(res);
        }
    })
};

exports.updateOrderDB = function (req, callback) {
    Orders.update({_id: req._id}, req, function (err,res) {
        if (err) throw err;
        else {
            callback(res);
        }
    });
};

exports.addCartOrderDB = function (req, callback) {
    var msg = false;
    Users.find({username: req.username}, function (err, res) {
        if (err) throw err;
        else {
            var status = false, cartOrderArray = res[0].cartOrder;
            cartOrderArray.forEach(function (orderId) {
                if (orderId === req.id) {
                    status = true;
                }
            });

            if (!status) {
                cartOrderArray.push(req.id);
                Users.update({username: req.username}, {$set: {cartOrder: cartOrderArray}}, function (err, res) {
                    if (err) throw err;
                    else {
                        msg = true;
                        callback(msg);
                    }
                });

            } else {
                callback(msg);
            }
        }
    });
};

exports.getCartDB = function (req, callback) {
    Users.find({username: req.username}, function (err, res) {
        var orderListArray = [], cartLength = res[0].cartOrder.length;
        res[0].cartOrder.forEach(function (orderId) {
            Orders.find({_id: orderId}, function (err, res) {
                if (err) throw err;
                else {
                    orderListArray.push(res[0]);
                    if (orderListArray.length === cartLength) {
                        callback(orderListArray)
                    }
                }
            });
        });

    });
};

exports.cartDeleteDB = function (req, callback) {
    Users.find({username: req.username}, function (err, res) {
        if (err) throw err;
        else {
            var cartOrderArray = res[0].cartOrder, index = -1;
            for (var i=0; i<cartOrderArray.length; i++) {
                if (cartOrderArray[i] === req.orderId) {
                    index = i;

                    cartOrderArray.splice(index, 1);
                    Users.update({username: req.username}, {$set: {cartOrder: cartOrderArray}}, function (err, res) {
                        if (err) throw err;
                        else {
                            callback('ok');
                        }
                    });
                }
            }
        }
    });
};

exports.toPayDB = function (req, callback) {
    Users.find({username: req.username},  function (err, res) {
        if (err) throw err;
        else {
            var orderList = res[0].payOrders,
                cartOrders = res[0].cartOrder,
                totalLength = parseInt(res[0].payOrders.length) + parseInt(req.payOrder.length),
                newCartOrder = [];
            req.payOrder.forEach(function (order) {

                orderList.push(order);
                for (var i=0; i<cartOrders.length; i++) {
                    if (order.goodsId === cartOrders[i]) {

                    } else {
                        newCartOrder.push(cartOrders[i]);
                    }
                }
                if (parseInt(orderList.length) === totalLength) {

                    Users.update({username: req.username}, {$set: {payOrders: orderList, thisPayOrders: req.payOrder}, cartOrder: newCartOrder}, function (err, res) {
                        if (err) throw err;
                        else {
                            callback(res);
                        }
                    });
                }
            });
        }
    });
};

exports.getPayOrderDB = function (req, callback) {
    Users.find({username: req.username}, function (err, res) {
        if (err) throw err;
        else {
            callback(res[0]);
        }
    });
};

exports.getUnSureOrderDB = function (req, callback) {
    Users.find({username: req.username}, function (err, res) {
        if (err) throw err;
        else {
            callback(res[0].payOrders);
        }
    });
};

exports.searchKeyWorldDB = function (req, callback) {
    Orders.find({"$or": [{'goodsName': new RegExp(req.searchData)},{describe: new RegExp(req.searchData)}]}, function (err, res) {
        if (err) throw err;
        else {
            console.log(res);
            callback(res);
        }
    });
};

exports.getReceiptAddressDB = function (req, callback) {
    Users.find({username: req.username}, function (err, res) {
        if (err) throw err;
        else {
            callback(res[0].receiptAddress);
        }
    });
};

exports.setReceiptAddressDB = function (req, callback) {
    Users.find({username: req.username}, function (err, res) {
        if (err) throw err;
        else {
            var addressList = res[0].receiptAddress;
            addressList.push(req.address);

            Users.update({username: req.username}, {$set: {receiptAddress: addressList}}, function (err, res) {
                if (err) throw err;
                else {
                    callback(res[0]);
                }
            });
        }
    });
};

exports.toSureOrderDB = function (req, callback) {
    //第一步：存入确认过的订单信息到 myOrders 字段
    Users.find({username: req.username}, function (err, res) {
        if (err) throw err;
        else {
            var orderList = res[0].myOrders, code = 0;
            orderList.push(req.data);
            console.log(orderList);

            Users.update({username: req.username}, {$set: {myOrders: orderList}}, function (err, res) {
                if (err) throw err;
                else {

                    //第二步：更新Orders集合中对应商品的数量
                    req.data.payOrders.forEach(function (order) {
                        Orders.find({_id: order.goodsId}, function (err, res) {
                            if (err) throw err;
                            else {
                                var num = res[0].num, outNum = 0;
                                num = num - parseInt(order.selectNum);
                                if (num < 0) {
                                    num = 0;
                                }
                                console.log('outNum:'+res[0].outNum);
                                if (res[0].outNum) {
                                    outNum = res[0].outNum;
                                    outNum += parseInt(order.selectNum);
                                } else {
                                    outNum = parseInt(order.selectNum);
                                }
                                console.log(outNum);

                                Orders.update({_id: order.goodsId}, {$set: {num: num, outNum: outNum}}, function (err, res) {
                                    if (err) throw err;
                                    else {
                                        code += 1;
                                        if (code === parseInt(req.data.payOrders.length)) {
                                            //第三步：删除Users集合中 payOrders 字段里对应的商品；
                                            Users.find({username: req.username}, function (err, res) {
                                                if (err) throw err;
                                                else {
                                                    console.log('into');
                                                    var newPayOrders = [], m=0;
                                                    /*console.log('oldPayOrders'+ res[0].payOrders);*/
                                                    res[0].payOrders.forEach(function (obj) {
                                                        req.data.payOrders.forEach(function (order) {
                                                            console.log(obj.goodsId);
                                                            console.log(order.goodsId);
                                                            if (obj.goodsId !== order.goodsId) {
                                                                newPayOrders.push(obj);
                                                            }else {
                                                                m +=1;
                                                            }

                                                            /*console.log(newPayOrders);*/
                                                            console.log('m:'+m+', length:'+parseInt(req.data.payOrders.length));
                                                            if (m ===  parseInt(req.data.payOrders.length)) {
                                                                Users.update({username: req.username}, {$set: {payOrders: newPayOrders}},
                                                                    function (err, res) {
                                                                        if (err) throw err;
                                                                        else {
                                                                            callback();
                                                                        }
                                                                    });
                                                            }
                                                        });
                                                    });
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    });
                }
            });
        }
    })
};

exports.getMyOrdersDB = function (req, callback) {
  Users.find({username: req.username}, function (err, res) {
      if (err) throw err;
      else {
          console.log(res[0].myOrders.length);
          if (res[0].myOrders.length > 0) {
              callback(res[0].myOrders);
          }else {
              callback(0);
          }
      }
  });
};

exports.setOrderCommentDB = function (req, callback) {
    Orders.find({_id: req.id}, function (err, res) {
        if (err) throw err;
        else {
            var newComments = [];

            if (res[0].comments) {
                newComments = res[0].comments;
                newComments.push(req.data);
            } else {
                newComments.push(req.data);
            }

            Orders.update({_id: req.id}, {$set: {comments: newComments}}, function (err, res) {
                if (err) throw err;
                else {
                    if (res.ok) {
                        callback(true);
                    } else {
                        callback(false);
                    }
                }
            });

        }
    });
};

exports.removeSureOrderDB = function (req, callback) {
    Users.find({username: req.username}, function (err, res) {
        if (err) throw err;
        else {
            var newPayOrders = [], code = 0;
            res[0].payOrders.forEach(function (order) {
                if (order.goodsId === req.goodsId) {
                    code += 1;
                } else {
                    newPayOrders.push(order);
                    code += 1;
                }

                if (code === parseInt(res[0].payOrders.length)) {
                    Users.update({username: req.username}, {$set: {payOrders: newPayOrders}}, function (err, res) {
                        if (err) throw err;
                        else {
                            callback(res);
                        }
                    });
                }
            });
        }
    });
};

exports.toSurePayOrderDB = function (req, callback) {
    Users.find({username: req.username}, function (err, res) {
        if (err) throw err;
        else {
            var newPayOrders = [], code = 0, thisPayOrder;
            res[0].payOrders.forEach(function (order) {
                if (order.goodsId === req.goodsId) {
                    code += 1;
                    thisPayOrder = order;
                } else {
                    newPayOrders.push(order);
                    code += 1;
                }

                if (code === parseInt(res[0].payOrders.length)) {
                    Users.update({username: req.username}, {$set: {payOrders: newPayOrders, thisPayOrders: thisPayOrder}}, function (err, res) {
                        if (err) throw err;
                        else {
                            callback(res);
                        }
                    });
                }
            });
        }
    });
};

exports.getCenterMsgDB = function (req, callback) {
    console.log('into DB');
    Users.find({username: req.username}, function (err, res) {
        if (err) throw err;
        else {
            callback(res[0]);
        }
    });
};

exports.setUserMsgDB = function (req,callback) {
    console.log(req.data);
    Users.update({username: req.username}, {$set: {email: req.data.email, password: req.data.password, tel: req.data.tel}},
        function (err, res) {
            if (err) throw err;
            else {
                callback(res[0]);
            }
        });
};

exports.updateReceiptDB = function (req, callback) {

    Users.update({username: req.username}, {$set: {receiptAddress: req.receipt}}, function (err, res) {
        if (err) throw err;
        else {
            callback(res[0]);
        }
    });
};
