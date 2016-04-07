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
  res.render('index', { rows: [],username: req.session.username });
});

router.get('/uploadOrder', function (req, res, next) {
  console.log(req.session.username);
  res.render('uploadOrder', {errMsg: null,username: req.session.username});
});

module.exports = router;
