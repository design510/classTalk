/**
 * Created by Jasonqu on 2016/4/2.
 */

var MongoClient = require('mongodb').MongoClient;
var settings = require("../setting.js");

function _connectDB(callback){
    var url = settings.dbUrl;
    MongoClient.connect(url, function(err, db) {
        callback(err,db);
    });
}

//建立索引
init();
function init(){
    _connectDB(function(err,db){
        if(err){
            console.log("数据库连接错误");
            return;
        }
        db.collection('user').createIndex(
            { "username": 1 },
            null,
            function(err, results) {
                if(err){
                    console.log(err);
                    return;
                }
                console.log("索引建立成功："+results);
            }
        );
    })
}



//添加数据
exports.insertOne = function(collectionName,json,callback){
    _connectDB(function(err,db){
        if(err){
            callback("数据库连接出错",null);
            db.close();
            return;
        }
        db.collection(collectionName).insertOne(json,function(err,result){
            callback(err,result);
            db.close();
        });
    });
};

//查找数据
exports.find = function(collectionName,searchObj,pageObj,sortObj,callback){
    _connectDB(function(err,db){
        if(err){
            callback("数据库连接出错",null);
            db.close();
            return;
        }
        var result = [];
        var pagesize = pageObj.pagesize;
        var page = pageObj.page;
        if(pagesize == undefined){
            pagesize = 0;
        }
        var pagenum = 0;
        if(page != undefined){
            pagenum = (parseInt(page) - 1) * parseInt(pagesize);
        }
        if(sortObj.sort == undefined){
            sortObj.sort = 1;
        }
        var cursor =db.collection(collectionName).find(searchObj).limit(pagesize).skip(pagenum).sort(sortObj);
        db.collection(collectionName).count(searchObj).then(function(count) {
            cursor.each(function(err, doc){
                if(err){
                    callback("数据显示出错",null);
                    db.close();
                    return;
                }
                if (doc != null) {
                    result.push(doc);
                } else {
                    var data = {};
                    data.result = result;
                    data.pagesize = pageObj.pagesize;
                    data.pageNo = page;
                    data.count = count;
                    callback(null,data);
                    db.close();
                }
            });
        });
    });
};

//删除数据
exports.delmany = function(collectionName,delObj,callback){
    _connectDB(function(err,db){
        if(err){
            callback("数据库连接失败",null);
            db.close();
            return;
        }
        db.collection(collectionName).deleteMany(delObj,function(err, results) {
            if(err){
                callback("删除数据失败",null);
                db.close();
                return;
            }
            callback(err,results);
            db.close();
            }
        );
    });
};

//修改数据
exports.updatemany = function(collectionName,json1,json2,callback){
    _connectDB(function(err,db){
        if(err){
            callback("数据库连接出错",null);
            db.close();
            return;
        }
        db.collection(collectionName).updateMany(json1,json2,function(err,results) {
            if(err){
                callback("修改数据失败",null);
                db.close();
                return;
            }
            callback(err,results);
            db.close();
        });
    });
};

//数据长度（在上面读取数据的时候已经将数据长度一起随数据返回了，这里只做测试使用）
exports.getAllCount = function(collectionName,callback){
    _connectDB(function(err,db){
        if(err){
            callback("数据库连接出错",null);
            db.close();
            return;
        }
        db.collection(collectionName).count({}).then(function(count) {
            callback(count);
            db.close();
        });
    });
};

