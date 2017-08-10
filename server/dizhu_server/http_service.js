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

app.get('/create_room',function(req,res){
	var uid = req.query.uid;
	console.log('create_room--uid:'+uid);
	http.send(res,0,"ok");
});

app.get('/get_server_info',function(req,res){
	var serverId = req.query.serverid;
	var sign = req.query.sign;
	console.log('serverId:'+serverId);
	console.log(sign);
	if(serverId  != config.SERVER_ID || sign == null){
		http.send(res,1,"invalid parameters");
		return;
	}

	var md5 = crypto.md5(serverId + config.ROOM_PRI_KEY);
	if(md5 != sign){
		http.send(res,1,"sign check failed.");
		return;
	}

	var locations = roomMgr.getUserLocations();
	var arr = [];
	for(var userId in locations){
		var roomId = locations[userId].roomId;
		arr.push(userId);
		arr.push(roomId);
	}
	http.send(res,0,"ok",{userroominfo:arr});
});

app.get("/show",function(req,res){
    console.log("get");
    http.send(res,0,"Ok");
});
var gameServerInfo = null;
var lastTickTime = 0;

//心跳
function update(){
	if(lastTickTime + config.HTTP_TICK_TIME < Date.now()){
		lastTickTime = Date.now();
		// gameServerInfo.load = roomMgr.getTotalRooms();
		gameServerInfo.load = 0;
		http.get(config.HALL_IP,config.HALL_PORT,"/register_gs",gameServerInfo,function(ret,data){
			if(ret == true){
				if(data.errcode != 0){
					console.log(data.errmsg);
				}
				
				if(data.ip != null){
					serverIp = data.ip;
				}
			}
			else{
				//
				lastTickTime = 0;
			}
		});

		// var mem = process.memoryUsage();
		// var format = function(bytes) {  
        //       return (bytes/1024/1024).toFixed(2)+'MB';  
        // }; 
		// console.log('Process: heapTotal '+format(mem.heapTotal) + ' heapUsed ' + format(mem.heapUsed) + ' rss ' + format(mem.rss));
	}
}


exports.start = function($config){
	config = $config;

	//
	gameServerInfo = {
		id:config.SERVER_ID,
		clientip:config.CLIENT_IP,
		clientport:config.CLIENT_PORT,
		httpPort:config.HTTP_PORT,
		load:0,
	};

	setInterval(update,5000);
	app.listen(config.HTTP_PORT,config.HALL_IP);
	
	console.log("game server is listening on " + config.HALL_IP + ":" + config.HTTP_PORT);
};