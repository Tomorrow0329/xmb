var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
var orders = require('./routes/order');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('123'));
app.use(session({
  secret: '123',
  name: 'xmb',   //�����nameֵ����cookie��name��Ĭ��cookie��name�ǣ�connect.sid
  cookie: {maxAge: 36000000 },  //����maxAge��36000000ms����10h��session����Ӧ��cookieʧЧ����
  resave: false,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.post('/signUp', orders.signUp);
app.post('/signIn', orders.signIn);
app.get('/initLoad', orders.initLoad);
app.post('/upload', orders.upload);
app.get('/orderDetail:id', orders.orderDetail);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
app.listen(10011, function () {
  console.log('Listen the port of 10011');
});


module.exports = app;
