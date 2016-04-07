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
            db.disconnect();
        })
    });
};

exports.upload = function (req, res, next) {
    console.log('into upload');
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = 'public/images';
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
                order.date=new Date(fields.date);
                order.goodsCode = fields.goodsCode;
                order.classes = fields.classes;
                order.describe = fields.describe;
                order.file = fields.file;
                order.imagePath = avatarName;
                db.uploadOrder(order,function(){
                    db.disconnect();
                    /*
                     req.session.userName =fields.personName;
                     */
                });
            });
        });
    });
    console.log(req.body.personName);
    res.render('uploadOrder', {username:req.body.personName,errMsg:"商品发布成功！ "});
};
