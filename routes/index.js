var express = require('express');
var router = express.Router();

/* GET home page. */
router.get(['/', '/signIn'], function(req, res, next) {
  res.render('signIn', { title: 'signIn' });
});

router.get('/signUp', function(req, res, next) {
  res.render('signUp', { title: 'signUp' });
});

router.get('/index', function (req, res, next) {
  res.render('index', { rows: [], username: req.session.username });
});

router.get('/uploadOrder', function (req, res, next) {
  res.render('uploadOrder', {errMsg: null, username: req.session.username});
});

router.get('/payFor', function (req, res, next) {
  res.render('payFor', {username: req.session.username});
});

router.get('/toCenter', function (req, res, next) {
  res.render('person-center', {username:req.session.username});
});

router.get('/unSureOrder', function (req, res, next) {
  res.render('unSureOrder', {username: req.session.username});
});

router.get('/myOrders', function (req, res, next) {
  res.render('orderOfMe', {username: req.session.username});
});

router.get('/inputSearch/:searchKeyWorld', function (req, res, next) {
  res.render('orderClasses', {username: req.session.username, orders: []});
});

module.exports = router;
