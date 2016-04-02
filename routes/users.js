/**
 * Created by lenovo on 2016/3/27.
 */
var domain = require('domain');
var db = require('./db');
exports.signUp = function (req, res) {
    console.log('user into');
    var d = domain.create();
    d.on('err', function (err) {
        next(err);
    });

    d.run(function () {
        db.connect(function () {
            var user = req.body;
            db.signUp(user, function (res) {
                db.disconnect();
                //res.send({errMsg : 'ok'});
                if(db.warn){
                    res.send({errMsg:db.warn});
                }else{
                    res.send({username:user.username,errMsg:null});
                }
            });
        });
    });
};
