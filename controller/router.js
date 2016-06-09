/**
 * Created by Jasonqu on 2016/4/17.
 */
var formidable = require("formidable");
var data = require("../model/data.js");
var crypto = require("crypto");
var path = require("path");
var fs = require("fs");
var sd = require("silly-datetime");
var gm = require('gm');


var md5 = function(password){
    var md5 = crypto.createHash('md5');
    var password = md5.update(password).digest("base64");
    return password;
};

exports.showIndex = function(req,res,next){
    var login = req.session.login == "1" ? true : false;
    var username = req.session.login == "1" ? req.session.username : "";
    data.goAvatar(login,username,function(err,results){
        if(err){
            next();
            return;
        }
        var avatar = "default.jpg";
        if(results.result.length != 0){
            avatar = results.result[0].avatar
        }
        res.render("index",{
            "username":username,
            "login":login,
            "avatar":avatar
        });
    });

};

exports.showLogin = function(req,res,next){
    res.render("login",{
        "username":req.session.login == "1" ? req.session.username : "",
        "login":req.session.login == "1" ? true : false
    });
};

exports.showRegister = function(req,res,next){
    res.render("register",{
        "username":req.session.login == "1" ? req.session.username : "",
        "login":req.session.login == "1" ? true : false
    });
};

exports.subReg = function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        if(err){
            console.log(err);
            return;
        }
        var username = fields.username;
        var password = md5(md5(fields.password) + "D6BB2235B9F1362698B3ADB2C4A1C360");
        var regObj = {
            "username":username,
            "password":password,
            "avatar":"default.jpg"
        };
        data.saveReg(regObj,function(err,results){
            if(err){
                next();
                return;
            }
            if(results == 2){
                res.json("用户名被占用");
            }else if(results == 1){
                req.session.username = regObj.username;
                req.session.login = "1";
                var hour = 20000000;
                req.session.cookie.expires = new Date(Date.now() + hour);
                req.session.cookie.maxAge = hour;
                res.json("注册成功");
            }
        });
    });
};

exports.subLogin = function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        if(err){
            console.log(err);
            return;
        }
        var username = fields.username;
        var password = md5(md5(fields.password) + "D6BB2235B9F1362698B3ADB2C4A1C360");
        var longinObj = {
            "username":username,
            "password":password,
            "avatar":"default.jpg"
        };
        data.goLogin(longinObj,function(err,results){
            if(err){
                next();
                return;
            }
            if(results == 2){
                res.json("该用户不存在");
            }else if(results == 3){
                res.json("密码错误");
            }else if(results == 1){
                req.session.username = longinObj.username;
                req.session.login = "1";
                var hour = 20000000;
                req.session.cookie.expires = new Date(Date.now() + hour);
                req.session.cookie.maxAge = hour;
                res.json("登录成功");
            }
        });
    });
};

//上传头像
exports.showAvatar = function(req,res,next){
    if(req.session.login != "1"){
        //res.send("非法请求，请先登录");
        res.redirect("/login");
        return;
    }
    res.render("upload",{
        "username":req.session.username,
        "login":true
    });
};

//上传头像新
exports.showUploadNew = function(req,res,next){
    if(req.session.login != "1"){
        //res.send("非法请求，请先登录");
        res.redirect("/login");
        return;
    }
    res.render("upload_new",{
        "username":req.session.username,
        "login":true
    });
};

//上传图片接口
exports.upAvatar = function(req,res,next){
    //console.log(req);
    var filename = req.files.file.originalFilename || path.basename(req.files.file.path);

    var extname = path.extname(filename);
    var newFileName = req.session.username + extname;
    var uploadDir = path.normalize(__dirname + "/../uploads");
    var targetPath = uploadDir + "/avatar/" + newFileName;

    //复制图片
    fs.createReadStream(req.files.file.path).pipe(fs.createWriteStream(targetPath));

    req.session.avatar = newFileName;
    res.json({code: 200, msg: {url: 'http://' + req.headers.host + '/uploads/avatar/' + newFileName}});


};
/*exports.upAvatar = function(req,res,next){
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = path.normalize(__dirname + "/../uploads");
    form.parse(req, function(err, fields, files) {
        if(err){
            next();
            return;
        }
        var photoSize = parseInt(files.avatar.size);
        var oldpath = files.avatar.path;
        if(photoSize > 102400000){
            fs.unlink(oldpath, function(){
                console.log("图片尺寸太大被删除");
            });
            res.send("图片大小不能大于100000k");
            return;
        }
        var extname = path.extname(files.avatar.name);
        var nowdate = sd.format(new Date(), 'YYYYMMDDHHmm');
        //var newFileName = nowdate + extname;
        var newFileName = req.session.username + extname;
        var newpath = form.uploadDir+"/avatar/"+newFileName;
        fs.rename(oldpath,newpath, function(err){
            if(err){
                res.send("修改图片名称失败");
            }
            req.session.avatar = newFileName;
            res.redirect("/cutImage");
        });

    });
};*/

exports.showCut = function(req,res,next){
    if(req.session.login != "1"){
        //res.send("非法请求，请先登录");
        res.redirect("/login");
        return;
    }
    res.render("cutImage",{
        "username":req.session.username,
        "login":true,
        "avatar":req.session.avatar
    });
};

exports.docrop = function(req,res,next){
    var username = req.session.username;
    var filename = req.session.avatar;
    var width = req.query.width;
    var height = req.query.height;
    var top = req.query.top;
    var left = req.query.left;
    gm('./uploads/avatar/'+filename)
        .crop(width, height, left, top)
        .resize(200,200,"!")
        .write('./uploads/avatar/'+filename, function (err) {
            if (err){
                console.log(err);
                return;
            }
            var json1 = {"username":username};
            var json2 = {"avatar":filename};
            data.updateAvatar(json1,json2,function(err,results){
                if(err){
                    next();
                    return;
                }
                res.json("1");
            });
        });
};

exports.doLogout = function(req,res,next){
    req.session.destroy(function(err) {
        if(err){
            console.log("退出登录出错");
            return;
        }
        res.json("1");
    });
};

//发表说说
exports.showPublish = function(req,res,next){
    if(req.session.login != "1"){
        res.redirect("/login");
        return;
    }
    var username = req.session.username;
    var login = true;
    data.goAvatar(login,username,function(err,results){
        if(err){
            next();
            return;
        }
        var avatar = 'http://' + req.headers.host + '/uploads/avatar/' + results.result[0].avatar;
        res.render("talk_publish",{
            "username":username,
            "login":login,
            "avatar":avatar
        });
    });
};

exports.dosubTalk = function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        if(err){
            console.log(err);
            return;
        }
        //var updateTime = (new Date()).valueOf();    //时间戳
        var updateTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
        fields.updateTime = updateTime;
        fields.username = req.session.username;
        var login = true;
        data.goAvatar(login,fields.username,function(err,results){
            if(err){
                next();
                return;
            }
            fields.avatar = '/uploads/avatar/' + results.result[0].avatar;
            data.savaTalk(fields,function(err,msg){
                if(err){
                    next();
                    return;
                }
                if(msg){
                    res.send(true);
                }
            });
        });
    });
};

//我的说说
exports.showMyTalk = function(req,res,next){
    if(req.session.login != "1"){
        res.redirect("/login");
        return;
    }
    var username = req.session.username;
    var login = req.session.login;
    res.render("mytalk",{
        "username":username,
        "login":login
    });
};

exports.doMyTalk = function(req,res,next){
    var username = req.session.username;
    var pagesize = parseInt(req.query.pagesize);
    var page = parseInt(req.query.page);
    var sort = parseInt(req.query.sort);
    var sortObj = {};
    if(sort == 1 || sort == -1){
        sortObj = {"updateTime":sort};
    }
    data.getTalk({"username":username},{"pagesize":pagesize,"page":page},sortObj,function(err,results){
        if(err){
            next();
            return;
        }
        res.json(results);
    });
};