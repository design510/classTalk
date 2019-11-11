/**
 * Created by Jasonqu on 2016/4/15.
 */
var express = require("express");
var app = express();
var cookieParser = require("cookie-parser");
var session = require("express-session");
var router = require("./controller/router.js");
var multipart = require('connect-multiparty');
var server = require("http").Server(app);
var io = require("socket.io")(server);

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.set("view engine","ejs");
app.use(cookieParser());
app.use("/",express.static(__dirname+"/public"));
app.use("/uploads",express.static(__dirname+"/uploads"));

//路由
app.get("/", router.showIndex);//首页
app.get("/login", router.showLogin);//登录
app.get("/register", router.showRegister);//注册
//app.get("/avatar", router.showAvatar);//上传图像
//app.get("/cutImage", router.showCut);//裁剪头像
app.get("/uploadnew", router.showUploadNew);//上传图像(新)
app.get("/publishTalk",router.showPublish);//发表说说
app.get("/myTalk",router.showMyTalk);//我的说说
app.get("/talk/:id",router.showTalkDetail);//说说详情
app.get("/userlist",router.showUserList);//用户列表
app.get("/update_file",router.showFile);//上传文件

//接口
app.post("/subReg",router.subReg);//注册
app.post("/subLogin",router.subLogin);//登录
//app.post("/uploadAvatar",router.upAvatar);//上传图像
app.post("/uploadAvatar",multipart(),router.upAvatar);//上传图像
app.get("/crop",router.docrop);//裁剪头像
app.post("/logout",router.doLogout);//退出登录
app.post("/subTalk", router.dosubTalk);//发表说说
app.get("/doMyTalk",router.doMyTalk);//我的说说
app.get("/doAllTalk",router.doAllTalk);//所有说说列表
app.post("/subComment",router.doSubComment);//发表评论
app.post("/updateFile",router.updateFile);//上传文件

server.listen(3002,"192.168.1.106");

io.on('connection', function (socket) {
    socket.on('myclient', function (data) {
        //console.log(data);
        io.emit(data.fuserId, data);
    });
});
