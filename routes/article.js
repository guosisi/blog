/**
 * Created by pc on 2016/12/10.
 */
var express = require('express');
var Article = require('../db').Article;
var Auth = require('../auth');
// 返回一个路由容器实例
var router = express.Router();
router.get('/add',Auth.checkLogin, function (req, res) {
    // res.send('发表文章');
    res.render('article/add',{title: '发表文章', article:{}});
});
// 发表文章的路由
router.post('/add', Auth.checkLogin, function (req, res) {
    var article = req.body;
    article.user = req.session.SESSION_USER._id;
    Article.create(article, function (err, doc) {
        if(err){
            req.session.SESSION_ERR= err;
            res.redirect('back');
        }else {
            req.session.success = '发表文章成功';
            res.redirect('/');
        }
    })

});

router.get('/detail/:_id', function (req, res) {
    var _id = req.params._id; //从路径的参数中获取_id
    Article.findById(_id, function (err, article) {
        res.render('article/detail',{title:'文章正文', article})
    })
});

router.get('/remove/:_id', Auth.checkLogin, function (req, res) {
    var _id = req.params._id; //从路径的参数中获取_id
    Article.remove({_id}, function (err, result) {
        if(err){
            req.session.SESSION_ERR = err;
            res.redirect('back');
        }else{
            req.session.SESSION_ERR = "删除成功";
            res.redirect('/');
        }
    })
});
router.get('/update/:_id', Auth.checkLogin, function (req, res) {
    var _id = req.params._id; //从路径的参数中获取_id
    Article.findById(_id, function (err, article) {
        res.render('article/add', {title: '更新文章', article})
    })
});
// 保存修改
router.post('/update/:_id', Auth.checkLogin, function (req, res) {
    var _id = req.params._id; //从路径的参数中获取_id
    Article.update({_id: _id},req.body, function (err, article) {
        if(err){
            req.session.error = err;
            res.redirect('back');
        }else{
            res.redirect('/article/detail/'+_id);
        }
    })
});

module.exports = router;