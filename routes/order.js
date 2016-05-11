var domain = require('domain');
var db = require('./db');
var formidable = require('formidable');
var fs = require('fs');
//var config = require();
exports.signUp = function (req, res, next) {
    var d = domain.create();
    d.on('err', function (err) {
        next(err);
    });

    d.run(function () {
        db.connect(function () {
            var user = req.body;
            db.signUp(user, function (errMsg) {
                db.disconnect();
                //res.send({errMsg : 'ok'});
                if(errMsg){
                    res.send({errMsg:errMsg});
                }else{
                    res.send({username:user.username,errMsg:null});
                }
            });
        });
    });
};

exports.signIn = function (req, res, next) {
    var d = domain.create();
    d.on('err', function (err) {
        next(err);
    });

    d.run(function () {
        db.connect(function () {
            var user = req.body;
            db.signIn(user, function (errMsg) {
                db.disconnect();
                //res.send({errMsg : 'ok'});
                if(errMsg){
                    res.send({errMsg:errMsg});
                }else{
                    req.session.username = user.username;
                    res.send({username:user.username,errMsg:null});
                }
            });
        });
    });
};

exports.initLoad = function (req, res, next) {
    var d = domain.create();
    d.on('error', function (err) {
        next(err);
    });

    d.run(function () {
        db.connect(function () {
          db.initLoad(function (data) {
            db.disconnect();
            res.send({rows: data, username: req.session.username});
          });
        })
    });
};

exports.upload = function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = 'public/uploadData/';
    form.keepExtensions = true;
    form
        .maxFieldsSize = 2 * 1024 * 1024;
    form.parse(req, function(err, fields, files,res) {
        if (err) {
            res.locals.error = err;
            res.render('index', { title: TITLE });
            return;
        }

        var extName = '';
        switch (files.fulAvatar.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }

        if(extName.length == 0){
            res.locals.error = '只支锟斤拷png锟斤拷jpg锟斤拷式图片';
            res.render('orderUpload', { personName: fields.personName,errMsg:"只支锟斤拷png锟斤拷jpg锟斤拷式图片"});
            return;
        }

        var avatarName = Math.random() + '.' + extName;
        var newPath = form.uploadDir + avatarName;
        fs.renameSync(files.fulAvatar.path, newPath);  //锟斤拷锟斤拷锟斤拷
        var d=domain.create();
        d.on('err',function(err){
            next(err);
        });
        d.run(function(){
            db.connect(function(){
                var order = new Object();
                order.username = fields.username;
                order.goodsName = fields.goodsName;
                order.num = fields.num;
                order.price = fields.price;
                order.tel=fields.tel;
                order.email = fields.email;
                order.date=new Date().getTime();
                order.goodsCode = fields.goodsCode;
                order.goodsChildCode = fields.goodsChildCode;
                order.optionGardCode = fields.optionGardCode;
                order.describe = fields.describe;
                order.file = fields.file;
                order.imagePath = avatarName;
                db.uploadOrder(order,function(){
                    db.disconnect();
                     req.session.userName =fields.personName;
                });
            });
        });
    });
    res.render('uploadOrder', {username:req.session.username,errMsg:"商品发布成功！"});
};

exports.orderDetail = function (req, res, next) {
  var d = domain.create();

  d.on('err', function (err) {
    next(err);
  });

  d.run(function () {
    db.connect(function () {
      db.getOrder({orderId: req.params.id}, function (order) {

        db.disconnect();

        res.render('orderDetail', {username: req.session.username, goods: order});
      });
    });
  });
};

exports.orderFocus = function (req, res, next) {
  var d = domain.create();

  d.on('err', function (err) {
    next(err);
  });

  d.run(function () {
    db.connect(function () {
      var focusData = {
        username: req.session.username,
        orderId: req.body.orderId
      };
      db.setFocus(focusData, function (resMsg) {
        db.disconnect();
        if (resMsg === 'success') {
          res.send({focusStatus: true});
        } else {
          res.send({focusStatus: false});
        }
      });
    })
  });
};

exports.getFocus = function (req, res, next) {
  var d = domain.create();

  d.on('err', function (err) {
    next(err);
  });

  d.run(function () {
    db.connect(function () {
      var focusData = {
        username: req.session.username,
        orderId: req.query.orderId
      };
      db.getFocus(focusData, function (orderFocusArray) {
        db.disconnect();
        var focusStatus = false;
        orderFocusArray.focusOrder.forEach(function (orderId) {
          if (orderId === req.query.orderId) {
            focusStatus = true;
          }
        });

        res.send({focusStatus : focusStatus});
      });
    })
  });
};

exports.orderCancelFocus = function (req, res, next) {
  var d = domain.create();

  d.on('err', function (err) {
    next(err);
  });

  d.run(function () {
    db.connect(function () {
      var focusData = {
        username: req.session.username,
        orderId: req.body.orderId
      };
      db.cancelFocus(focusData, function (resMsg) {
        db.disconnect();
        var focusStatus = false;
        if (resMsg === 'success') {
          focusStatus = true
        }

        res.send({focusStatus : focusStatus});
      });
    })
  });
};

exports.getFocusList = function (req, res, next) {
  var d = domain.create();
  d.on('err', function(err) {
    next(err);
  });

  d.run(function () {
    db.connect(function () {
      console.log(req.query.data);
      db.getFocusList(req.query.data, function (orderFocusArray) {

        db.disconnect();
        res.send({orderFocusArray: orderFocusArray});
      });
    });
  });
};

exports.orderOrderFocus = function (req, res, next) {
  var d = domain.create();

  d.on('err', function (err) {
    next(err);
  });

  d.run(function () {
    db.connect(function () {
      var data = {
        username: req.session.username
      };
      db.getFocus(data, function (data) {

        db.disconnect();
        res.render('orderFocus', {username: req.session.username, orders: [], data: data.focusOrder});
      });
    });
  });
};

exports.orderOnline = function (req,res, next) {
  var d = domain.create();

  d.on('err', function (err) {
    next(err);
  });

  d.run(function () {
    db.connect(function () {
      var data = {
        username: req.session.username
      };
      db.orderOnlineDB(data, function (orders) {

        db.disconnect();
        res.render('orderOnline', {username: req.session.username, orders: orders});
      });
    });
  });
};

exports.deleteOrder = function (req, res, next) {
  var d = domain.create();

  d.on('err', function (err) {
    next(err);
  });

  d.run(function () {
    db.connect(function () {
      var data = {
        username: req.session.username,
        orderId: req.body.orderId
      };
      db.deleteOrderDB(data, function (resMsg) {

        db.disconnect();
        res.send({resMsg: resMsg});
      });
    });
  });
};

exports.classSearch = function (req, res, next) {
    var d = domain.create();
    d.on('err', function (err) {
        next(err);
    });

    d.run(function () {
        db.connect(function () {
            var data = {
                goodsCode: req.params.codeId
            };
            db.classSearchDB(data, function (data) {
                db.disconnect();
                console.log(data);
                res.render('orderClasses', {username: req.session.username, orders: data});
            })
        })
    });
};

exports.searchClass = function (req, res, next) {
    var d = domain.create();
    d.on('err', function (err) {
        next(err);
    });

    d.run(function () {
        db.connect(function () {
            console.log(req);
            db.searchClassDB(req.body, function (data) {
                db.disconnect();
                res.send({searchOrder: data})
            })
        })
    });
};

exports.correctOrder = function (req, res, next) {
    var d = domain.create();
    d.on('err', function (err) {
        next(err);
    });

    d.run(function () {
        db.connect(function () {
            db.correctOrderDB(req.params, function (data) {
                db.disconnect();
                res.render('correctOrder', {searchOrders: data, username: req.session.username, errMsg: ''})
            })
        })
    });
};

exports.updateOrder = function (req, res, next) {
    var d = domain.create();
    d.on('err', function (err) {
        next(err);
    });

    d.run(function () {});
    db.connect(function () {
        var order = new Object();
        order._id = req.body.id;
        order.num = req.body.num;
        order.price = req.body.price;
        order.tel=req.body.tel;
        order.email = req.body.email;
        order.date=new Date().getTime();
        order.describe = req.body.describe;
        db.updateOrderDB(order, function (data) {
            db.disconnect();
            res.render('uploadOrder', {username:req.session.username,errMsg:"修改成功！"});
        });
    })
};
exports.addCartOrder = function (req, res, next) {
    var d = domain.create();
    d.on('err', function (err) {
        next(err);
    });

    d.run(function () {
        db.connect(function () {
            var orderId = {
                username: req.session.username,
                id: req.query.orderId
            };

            db.addCartOrderDB(orderId, function (data) {
                db.disconnect();
                console.log(data);
                if (data) {
                    res.send({errMsg: true, username: req.session.username});
                } else {
                    res.send({errMsg: false, username: req.session.username});
                }
            });
        })
    });
};

exports.getCart = function (req, res, next) {
    var d = domain.create();

    d.on('err', function (err) {
        next(err);
    });

    d.run(function () {
        db.connect(function () {
            db.getCartDB({username: req.session.username}, function (orderListArray) {
                db.disconnect();
                console.log(orderListArray);
                res.render('cart', {orders: orderListArray, username: req.session.username});
            });
        })
    });
};
