/**
 * Created by pc on 2016/12/10.
 */
var mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect('mongodb://127.0.0.1/201610blog');
var ObjectId = mongoose.Schema.Types.ObjectId;
// 定义 schema
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    avatar: String  //头像
},{collection: 'user'});

// 定义模型并导出 如果上面没有给出集合的名称，集合的名称=模型名-->小写-->复数
exports.User = mongoose.model("User", UserSchema);

// 定义文章的模型
var ArticleSchema = new mongoose.Schema({
    title: String,
    content: String,
    createAt: {type:Date, default: new Date},
    user:{type: ObjectId, ref:'User'} // reference user表的主键
},{collection: 'article'});
exports.Article = mongoose.model("Article", ArticleSchema);
