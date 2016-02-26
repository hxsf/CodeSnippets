var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var exjwt = require('express-jwt');
// var unless = require('express-unless');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var hbs = require('hbs');
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// DB
// var mongo = require('./database/db');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
var statics = express.static(path.join(__dirname, 'public'));
// statics.unless = unless;
app.use(statics);

var secretCallback = function(req, payload, done){
    // var issuer = payload.iss;
    var secret = 'hxsf1011';
    done(null, secret);
};

// JsonWebTokens
// app.use(exjwt({secret: secretCallback,
//     credentialsRequired: true,
//     getToken: function fromHeaderOrQuerystring (req) {
//         console.log(req.query);
//         if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//             return req.headers.authorization.split(' ')[1];
//         } else if (req.query && req.query.token) {
//             return req.query.token;
//         } else if (req.cookies && req.cookies.token) {
//             return req.cookies.token;
//         }
//         return null;
//     }
// },function(req, res) {
//     if (!req.user.admin) return res.sendStatus(401);
//     res.sendStatus(200);
//   }).unless({path: ['/auth', '/login', '/about', '/', '/snippet/demo']}));

app.use('/', routes);
// app.use('/users', users);

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


module.exports = app;
