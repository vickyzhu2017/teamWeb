var express=require('express');
var port=process.env.PORT || 3000;
var path=require('path');
var app=express();
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');
//定义本地变量
app.locals.moment = require('moment');

//数据库连接
var dbUrl='mongodb://localhost/FDT';
mongoose.connect(dbUrl);

app.use(multipart());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, uploadDir:'./assets/images'}));
app.use(express.static(path.join(__dirname,'assets')))

app.use(cookieParser());
app.use(session({
    secret:'FDT',
    store: new MongoStore({
        url: dbUrl,
        collection: 'sessions'
    })

}))
app.set('view engine','jade');
//视图文件
app.set('views','./test');

//路由入口
require('./router')(app);
app.listen(port);

console.log("listening at the port "+port);

