var crypto = require('../utils/crypto');
var express = require('express');
var db = require('../utils/db');
var http = require('../utils/http');

var app = express();
var config = null;

var serverIp = "";

//测试
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By",' 3.2.1');
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});

app.get("/show",function(req,res){
    console.log("get");
    http.send(res,0,"Ok");
});


exports.start = function($config){
	config = $config;

	//
	gameServerInfo = {
		id:config.SERVER_ID,
		clientip:config.CLIENT_IP,
		clientport:config.CLIENT_PORT,
		httpPort:config.HTTP_PORT,
		// load:roomMgr.getTotalRooms(),
	};

	// setInterval(update,1000);
	app.listen(config.HTTP_PORT,config.HALL_IP);
	console.log("game server is listening on " + config.HALL_IP + ":" + config.HTTP_PORT);
};