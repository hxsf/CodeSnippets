var express = require('express');
var router = express.Router();
var userlist = require('../database/users');
var snippets = require('../database/snippets');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/all', function(req, res, next) {
    userlist.find(function(err, doc) {
        console.log(doc);
        res.render('all', {"users": doc});
    });
});

router.get('/new', function(req, res, next) {
    res.render('new');
});

router.post('/new', function(req, res, next) {
    console.log('req', req);
    console.log('req.body', req.body);
    console.log('req.query', req.query);
    userlist.findOne({"uid": "1345536101"}, function(err, doc) {
        var code = new snippets({
            title: req.body.title,
            remark: req.body.remark,
            codes: req.body.codes
        });
        code.save(function(err){
            if(err){
                return console.log('[save failed]: ', err);
            }
            res.send('aa');
        });
    });
});

module.exports = router;
