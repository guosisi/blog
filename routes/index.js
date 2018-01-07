/**
 * Created by pc on 2016/12/10.
 */
var express = require('express');
var router = express.Router();
var Article = require('../db').Article;
router.get('/',function(req,res){
    // populate 指的是填充， 用于把当前对象的一个属性从对象ID转成对象类型
    Article.find({}).populate('user').exec(function (err, items) {
        console.log(items);
        res.render('index',{title:'首页', items});  // es6 语法  key-value 相同写一个就好
    })

});
module.exports = router;