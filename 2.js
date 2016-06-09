/**
 * Created by Jasonqu on 2016/4/16.
 */
var express = require("express");
var app = express();
var session = require("express-session");

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.get("/", function(req,res){
    if(req.session.login){
        res.send("欢迎你："+req.session.name);
        return;
    }
    res.send("请先登录");
});

app.get("/login", function(req,res){
    req.session.login = "1";
    req.session.name = "不小瓜";
    var hour = 20000;
    req.session.cookie.expires = new Date(Date.now() + hour);
    req.session.cookie.maxAge = hour;
    res.send("登录成功");
});

app.listen(3002,"127.0.0.1");


