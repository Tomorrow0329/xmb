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
    form.maxFieldsSize = 2 * 1024 * 1024;
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
            res.locals.error = 'ֻ֧��png��jpg��ʽͼƬ';
            res.render('orderUpload', { personName: fields.personName,errMsg:"ֻ֧��png��jpg��ʽͼƬ"});
            return;
        }

        var avatarName = Math.random() + '.' + extName;
        var newPath = form.uploadDir + avatarName;
        fs.renameSync(files.fulAvatar.path, newPath);  //������
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
                order.grade = fields.grade;
                order.tel=fields.tel;
                order.email = fields.email;
                order.date=new Date().getTime();
                order.goodsCode = fields.goodsCode;
                order.classes = fields.classes;
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
    res.render('uploadOrder', {username:req.session.username,errMsg:"商品发布成功！ "});
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
        orderId: req.body.orderId
      };
      db.getFocus(focusData, function (orderFocusArray) {
        db.disconnect();
        var focusStatus = false;
        orderFocusArray.focusOrder.forEach(function (orderId) {
          if (orderId === req.body.orderId) {
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
          focusStatus = false
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
