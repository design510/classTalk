/**
 * Created by Jasonqu on 2016/4/17.
 */
var express = require("express");
var app = express();
var fs = require('fs')
var gm = require('gm');

app.set("view engine", "ejs");

app.use("/", express.static(__dirname+"/public"));
app.use("/uploads", express.static(__dirname+"/uploads"));

app.get("/", function(req,res,next){
    /*gm('./uploads/7.jpg')//等比缩小图片240*240
        .resize(240, 240)
        .write('./uploads/resize.jpg', function (err) {
            if (!err) console.log('done');
        });*/

    /*gm('./uploads/7.jpg')//强制缩小图片240*240
        .resize(240, 240, '!')
        .write('./uploads/resize1.jpg', function (err) {
            if (!err) console.log('done');
        });*/

    /*gm('./uploads/7.jpg')////强制缩小图片240*240
        .resizeExact(240, 240)
        .write('./uploads/resize3.jpg', function (err) {
            if (err) console.log(err);
        });*/

    /*gm('./uploads/7.jpg')//获得图片宽高
        .size(function (err, size) {
            if (!err)
                console.log("width:"+size.width +",height:"+ size.height);
        });*/

    /*gm('./uploads/7.jpg')//获取图片的属性
        .identify(function (err, data) {
            if (!err) console.log(data)
        });*/

    /*gm('./uploads/7.jpg')//自动定向图片
        .autoOrient()
        .write('./uploads/auto_orient.jpg', function (err) {
            if (err) console.log(err);
        });*/

    gm('./uploads/7.jpg')
        .crop(300, 300, 100, 230)
        .write('./uploads/resize4.jpg', function (err) {
            if (err) console.log(err);
        });
    res.send("图片处理成功");
});

app.get("/avatar", function(req,res,next){
    res.render("avatar",{});
});

app.get("/crop",function(req,res,next){
    var filename = req.query.filename;
    var width = req.query.width;
    var height = req.query.height;
    var top = req.query.top;
    var left = req.query.left;
    gm('./uploads/'+filename)
        .crop(width, height, left, top)
        .resize(200,200,"!")
        .write('./uploads/resize000.jpg', function (err) {
            if (err){
                console.log(err);
                return;
            }
            res.send("裁剪成功");
        });
});


app.listen(3002, "127.0.0.1");
