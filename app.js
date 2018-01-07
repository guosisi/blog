/**
 * Created by pc on 2016/12/10.
 */

var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
const SESSION_USER = 'user';
const SESSION_ERR = 'error';

app.use(express.static(path.resolve('public')));
// 把请求体添加到 req.body 上  处理格式为查询字符串格式的请求体，处理完成之后，会把字符串转成对象放在 req.body 上
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// 指定模板引擎，自动添加后缀
app.set('view engine','html');
// 指定模板的存放目录
app.set('views',path.resolve('views'));
// 对于.html 的模板，用ejs 来渲染
app.engine('.html', require('ejs').__express);

app.use(session({
    resave: true, // 每次处理的时候都重新保存session
    saveUninitialized: true, //保存未初始化的session对象
    secret: 'zfpx', //加密cookie
    store: new MongoStore({ //把session 放到mongodb数据库里 session 持久化
      url: 'mongodb://127.0.0.1/201610blog'
    })
}));
app.use(function (req, res, next) {
    res.locals.error = req.session.SESSION_ERR;
    res.locals.user = req.session.SESSION_USER;
    req.session.SESSION_ERR = null;
    res.locals.success = req.session.success;
    req.session.success = null;
    next();
})

// 当路径是以/user开头的话，会交由路由中间件来处理
var index = require('./routes/index');
var user = require('./routes/user');
var article = require('./routes/article');
app.use('/', index);
app.use('/user', user);
app.use('/article', article);

app.listen(8080);