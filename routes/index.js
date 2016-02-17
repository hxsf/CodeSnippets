var express = require('express');
var router = express.Router();
var snippets = require('../database/snippets');
var hljs = require('highlight.js');
var marked = require('marked');
var renderer = new marked.Renderer();

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

var encodeHtml = function(s){
    return (typeof s != "string") ? s :
        s.replace( /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g,
                function($0){
                    var c = $0.charCodeAt(0), r = ["&#"];
                        c = (c == 0x20) ? 0xA0 : c;
                        r.push(c); r.push(";");
                        return r.join("");
                    });
  };

renderer.html = function(html){

    return '';
};

//debug code snippet.
var hxsf = {name: "呼啸随风", _id: "123567890ABCDEF123567890ABCDEF"};
// console.log(marked('I am using __markdown__.'));

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express','index': true, 'user': {} });
});
router.get('/home', function(req, res, next) {
    res.render('index', { title: 'Express'});
});
router.get('/snippet/:title', function(req, res, next) {
    // console.log(req.params);
    snippets.findOne({"title": req.params.title}).populate("user").exec(function(err, docs) {
        if(docs){
            docs.remark = marked(docs.remark);
            for (var i = 0; i < docs.codes.length; i++) {
                docs.codes[i] = hljs.highlightAuto(docs.codes[i]).value;
            }
        }else{
            docs = {"title": "未找到代码段"};
        }
        res.render('snippets', {"user": hxsf, "data": docs});
    });
});
router.get('/snippets', function(req, res, next) {
    res.render('snippets');
});
router.get('/about', function(req, res, next) {
    res.render('about');
});
router.get('/new', function(req, res, next) {
    res.render('new', {"user": hxsf});
});

module.exports = router;
