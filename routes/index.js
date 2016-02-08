var express = require('express');
var router = express.Router();
var snippets = require('../database/snippets');
var hljs = require('highlight.js');
var marked = require('marked');
marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: true,
    sanitize: true,
    smartLists: true,
    smartypants: false
});

console.log(marked('I am using __markdown__.'));

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express','index': true, 'user': {} });
});
router.get('/home', function(req, res, next) {
    res.render('index', { title: 'Express'});
});
router.get('/snippet/:title', function(req, res, next) {
    console.log(req.params);
    snippets.findOne({"title": req.params.title}).populate("user").exec(function(err, docs) {
        if(docs){
            docs.remark = marked(docs.remark);
            for (var i = 0; i < docs.codes.length; i++) {
                docs.codes[i] = hljs.highlightAuto(docs.codes[i]).value;
                console.log("code ", i, docs.codes[i]);
            }
        }else{
            docs = {"title": "未找到代码段"};
        }
        res.render('snippets', {"user": {"name": "呼啸随风"}, "data": docs});
    });
});
router.get('/snippets', function(req, res, next) {
    res.render('snippets');
});
router.get('/about', function(req, res, next) {
    res.render('about');
});

module.exports = router;
