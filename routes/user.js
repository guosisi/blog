/**
 * Created by pc on 2016/12/10.
 */
var express = require('express');

// 导入操作数据库的用户集合和模型
var User = require('../db').User;
var Auth = require('../auth');
// 返回一个路由容器实例
var router = express.Router();

var multer = require('multer');
var upload = multer({dest: './public/avatar'}); //指定上传文件的存放目录

//注册 /user/signup
router.get('/signup', Auth.checkNotLogin, function (req, res) {
    res.render('user/signup',{title: '注册'});
});
// 登录
router.get('/signin', Auth.checkNotLogin, function (req, res) {
    res.render('user/signin',{title: '登录'});
});
// 退出
router.get('/signout', Auth.checkLogin, function (req, res) {
    req.session.SESSION_USER = null;
    res.redirect('/user/signin');
});

//注册  当文件表单只有一个的时候 可用upload.single('avatar') avatar只的是文件域的名字
router.post('/signup', Auth.checkNotLogin, upload.single('avatar'), function (req, res) {
    var user = req.body;
    user.avatar = '/avatar/'+req.file.filename;
    User.findOne({username: user.username}, function (err, olduser) {
        if(err){
            req.session.SESSION_ERR = err;
            res.redirect('back');
        }else{
            if(olduser){
                req.session.SESSION_ERR = "用户名已经被注册";
                res.redirect('back');
            }else{
                User.create(user, function (err, doc) {
                    if(err){
                        req.session.SESSION_ERR = err;
                        res.redirect('back'); // back 表示让客户端返回上次请求的路径
                    }else{
                        req.session.SESSION_USER = doc;
                        res.redirect('/');
                    }
                });
            }
        }
    })

});
// 登录
router.post('/signin', Auth.checkNotLogin, function (req, res) {
    var user = req.body;
    User.findOne(user, function (err, thisuser) {
        if(err){
            req.session.SESSION_ERR = err;
            res.redirect('back');
        }else{
            if(thisuser){
                req.session.SESSION_USER = thisuser;
                res.redirect('/');
            }else{
                req.session.SESSION_ERR = '用户名或密码错误';
                res.redirect('back');
            }
        }
    })

});

module.exports = router;