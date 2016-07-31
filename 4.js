/**
 * Created by Jasonqu on 2016/7/26.
 */
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);


server.listen(3009,"127.0.0.1");