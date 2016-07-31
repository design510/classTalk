/**
 * Created by Jasonqu on 2016/4/17.
 */
var db = require("../model/db.js");

exports.getTalk = function(searchObj,pageObj,sortObj,callback){
    db.find("talk",searchObj,pageObj,sortObj,function(err,results){
        if(err){
            callback("获取数据错误",null);
            return;
        }
        callback(null,results);
    });
};

exports.saveReg = function(regObj,callback){
    db.find("user",{"username":regObj.username},{},{},function(err,results){
        if(err){
            callback("注册失败",null);
            return;
        }
        if(results.result.length != 0){
            callback(null,"2");//返回2表示用户名被占用
            return;
        }
        db.insertOne("user",regObj,function(err,result){
            if(err){
                callback("注册出错",null);
                return;
            }
            callback(null,"1");//返回1表示可以注册
        });
    });
};

exports.goLogin = function(longinObj,callback){
    db.find("user",{"username":longinObj.username},{},{},function(err,results){
        if(err){
            callback("登录失败",null);
            return;
        }
        var userInfo = results.result;
        if(userInfo.length == 0){
            callback(null,{code:"2",userId:""});//返回2表示该用户不存在
            return;
        }
        if(userInfo[0].password != longinObj.password){
            callback(null,{code:"3",userId:""});//返回3表示密码错误
        }else{
            callback(null,{code:"1",userId:userInfo[0]._id});//返回1表示登录成功
        }
    });
};

//查找头像
exports.goAvatar = function(login,username,callback){
    db.find("user",{"username":username},{},{},function(err,results){
        if(err){
            callback("查找数据出错",null);
            return;
        }
        callback(null,results);
    });
};

//上传头像
exports.updateAvatar = function(json1,json2,callback){
    db.updatemany("user",json1,{$set:json2,$currentDate:{"lastModified":true}},function(err,results){
        if(err){
            callback("修改头像出错",null);
            return;
        }
        callback(null,results);
    });
};

//保存说说
exports.savaTalk = function(fields,callback){
    db.insertOne("talk",fields,function(err,result){
        if(err){
            callback(err,null);
            return;
        }
        //callback(null,true);
        var viewcountObj = {
            "viewcount": 0,
            "talkId": String(result.ops[0]._id)
        };
        db.insertOne("viewcount",viewcountObj,function(err,result){
            if(err){
                callback(err,null);
                return;
            }
            callback(null,true);
        });
    });
};

//编辑说说
exports.editTalk = function(json1,json2,callback){
    db.updatemany("talk",json1,json2,function(err,results){
        if(err){
            callback("编辑说说出错",null);
            return;
        }
        callback(null,results);
    });
};

//获取说说浏览次数
exports.getViewCount = function(searchObj,pageObj,sortObj,callback){
    db.find("viewcount",searchObj,pageObj,sortObj,function(err,results){
        if(err){
            callback("浏览次数查询出错",null);
            return;
        }
        var count = results.result[0].viewcount + 1;
        db.updatemany("viewcount",searchObj,{$set:{"viewcount":count},$currentDate:{"lastModified":true}},function(err,results1){
            if(err){
                callback("更新浏览次数出错",null);
                return;
            }
            callback(null,results);
        });
    });
};

//获取所有用户列表
exports.getUserList = function(searchObj,pageObj,sortObj,callback){
    db.find("user",searchObj,pageObj,sortObj,function(err,results){
        if(err){
            callback("用户信息查询出错",null);
            return;
        }
        callback(null,results);
    });
};

//发表评论
exports.saveComment = function(fields,callback){
    db.insertOne("comment",fields,function(err,result){
        if(err){
            callback(err,null);
            return;
        }
        callback(null,true);
    });
};

//查找评论
exports.getComment = function(searchObj,pageObj,sortObj,callback){
    db.find("comment",searchObj,pageObj,sortObj,function(err,results){
        if(err){
            callback("获取数据错误",null);
            return;
        }
        callback(null,results);
    });
};
