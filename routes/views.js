/**
 * Created by lenovo on 2016/3/27.
 */
var express = require('express');
var router = express.Router();

/*router.get('/signIn', function (req, res) {
    res.render('index');
});*/

exports.get = function (req, res) {
    res.render('index');
};

//module.exports = router;
