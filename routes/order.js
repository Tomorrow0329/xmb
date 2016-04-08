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
            console.log(data);
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
        console.log('into parse of form');
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
        console.log('into upload:' + files);
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
      console.log(req.params);
      db.getOrder({orderId: req.params.id}, function (order) {

        db.disconnect();

        res.render('orderDetail', {username: req.session.username, goods: order});
      });
    });
  });
};
