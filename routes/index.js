var express = require('express');
var router = express.Router();
// var snippets = require('../database/snippets');
var hljs = require('highlight.js');
var marked = require('marked');
var qr = require('qr-encode');
var renderer = new marked.Renderer();
var randtoken = require('rand-token').generator({
    chars: 'base32'
});
var cfg = require('../config.json');

var Redis = require('ioredis');
var redis = new Redis({
    port: cfg.redis.port,
    host: cfg.redis.host,
    family: 4,
    password: cfg.redis.auth,
    db: 1
});

var getRandomToken = function(num, next) {
    var temp = randtoken.generate(num);
    redis.exists(temp, function(err, res) {
        if (res == 1) {
            getRandomToken(num+1, next);
        } else {
            next(null, temp);
        }
    });
};

marked.setOptions({
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
});

renderer.html = function(html){
    return '';
};

// var jwt = require('jsonwebtoken');

// var secretCallback = function(req, payload, done){
//     var issuer = payload.iss;
//     var secret = 'guest1011';
//     done(null, secret);
// };

//debug code snippet.
var guest = {name: "Guest", _id: "123567890ABCDEF123567890ABCDEF", guest: true};


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {'user': guest });
});
// router.get('/auth', function(req, res, next) {
//     var token = jwt.sign(guest, 'guest1011');
//     res.cookie('token',token,{ maxAge: 2000000, path:'/'});
//     // console.log(token);
//     res.send(token);
// });
router.get('/demo', function(req, res, next) {
    res.render('demo', {"user": guest});
});
router.get('/about', function(req, res, next) {
    res.render('about', {user: guest});
});
router.get('/new', function(req, res, next) {
    res.render('new', {"user": guest});
});
var log = function(err, result) {
    if (err) {
        console.log('error', err);
    } else {
        console.log('success', result);
    }
};
router.post('/new', function(req, res, next) {
    var data = req.body;
    if (typeof data.codes === 'string') {
        data.codes = new Array(data.codes);
    }
    getRandomToken(8, function(err, token) {
        redis.set(token, JSON.stringify(req.body), 'EX', 7 * 24 * 3600, log);
        var url = cfg.baseUrl+'/t/'+ token;
        res.render('success', {user: guest, token: token, url: url, src: qr(url, {type: 6, size: 6, level: 'Q'})});
    });
});
router.get('/t/:key', function(req, res, next) {
    redis.get(req.params.key, function(err, result) {
        if (err) {
            res.send('error');
            console.log('error', err);
        } else {
            if (result) {
                docs = JSON.parse(result);
                docs.remark = marked(docs.remark);
                for (var i = 0; i < docs.codes.length; i++) {
                    docs.codes[i] = hljs.highlightAuto(docs.codes[i]).value;
                }
            } else {
                docs = {"title": "未找到代码段"};
            }
            res.render('snippets', {"user": guest, "data": docs});
        }
    });
});

module.exports = router;
