/**
 * Created by Jasonqu on 2016/7/25.
 */

var http = require("http");
var fs = require("fs");
var server = http.createServer(function(req, res){
    if(req.url == "/"){
        fs.readFile("./socket.html", function(err, data){
            res.end(data);
        });
    }
});


var io = require("socket.io")(server);
io.on("connection", function(socket){
    console.log("一个客户端连接了");
    socket.on("tiwen",function(msg){
       console.log("客户端提问："+msg);
        socket.emit("huida","你真好");
    });
});

server.listen(3008, "127.0.0.1");
