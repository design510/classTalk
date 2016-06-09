/**
 * Created by Jasonqu on 2016/4/16.
 */
var express = require("express");
var app = express();
var cookieParser = require("cookie-parser");

app.use(cookieParser());

app.get("/", function(req,res,next){
    //res.cookie("sessionId","abcdefg",{"maxAge":900000,"httpOnly":true});
    //res.clearCookie("address");
    var cookieContent = req.cookies.address;
    var stringCookie = '';
    for(var i=0;i<cookieContent.length;i++){
        stringCookie += cookieContent[i];
        if(i<cookieContent.length-1){
            stringCookie += ',';
        }
    }
    res.send("猜你喜欢："+stringCookie);
});

app.get("/address",function(req,res,next){
    var cookieArr = req.cookies.address || [];
    var address = req.query.address;
    if(cookieArr.indexOf(address) == -1){
        cookieArr.push(address);
        res.cookie("address",cookieArr,{"maxAge":9000000,"httpOnly":true});
    }
    res.send("haha");
});


app.listen(3002,"127.0.0.1");


