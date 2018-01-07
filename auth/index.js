/**
 * Created by pc on 2016/12/11.
 */
/**
 * 要求后续的路由只能登录后的用户才能访问
 * @param req
 * @param res
 * @param next
 */
var checkLogin = function (req, res, next) {
    if(req.session.SESSION_USER){
        next();
    }else{
        res.redirect('/user/signin');
    }
}
exports.checkLogin = checkLogin;

exports.checkNotLogin = function (req, res, next) {
    if(req.session.SESSION_USER){
         req.session.SESSION_ERR = '只有未登录用户才能访问此资源';
        res.redirect('/');
    }else{
        next();
    }
}