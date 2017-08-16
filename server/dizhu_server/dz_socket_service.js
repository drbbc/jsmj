var crypto = require('../utils/crypto');
var db = require('../utils/db');

var tokenMgr = require('./dz_tokenmgr');
var roomMgr = require('./dz_roommgr');
var userMgr = require('./dz_usermgr');
var io = null;
exports.start = function(config,mgr){
	io = require('socket.io')(config.CLIENT_PORT);
	
	io.sockets.on('connection',function(socket){
		socket.on('login',function(data){
			data = JSON.parse(data);
			if(socket.userId != null){
				//已经登陆过的就忽略
				return;
			}
			var token = data.token;
			var roomId = data.roomid;
			var time = data.time;
			var sign = data.sign;

			console.log(roomId);
			console.log(token);
			console.log(time);
			console.log(sign);

			
			//检查参数合法性
			if(token == null || roomId == null || sign == null || time == null){
				console.log(1);
				socket.emit('login_result',{errcode:1,errmsg:"invalid parameters"});
				return;
			}
			
			//检查参数是否被篡改
			var md5 = crypto.md5(roomId + token + time + config.ROOM_PRI_KEY);
			if(md5 != sign){
				console.log(2);
				socket.emit('login_result',{errcode:2,errmsg:"login failed. invalid sign!"});
				return;
			}
			
			//检查token是否有效
			if(tokenMgr.isTokenValid(token)==false){
				console.log(3);
				socket.emit('login_result',{errcode:3,errmsg:"token out of time."});
				return;
			}
			
			//检查房间合法性
			var userId = tokenMgr.getUserID(token);
			var roomId = roomMgr.getUserRoom(userId);

			userMgr.bind(userId,socket);
			socket.userId = userId;

			//返回房间信息
			var roomInfo = roomMgr.getRoom(roomId);
			
			var seatIndex = roomMgr.getUserSeat(userId);
			roomInfo.seats[seatIndex].ip = socket.handshake.address;

			var userData = null;
			var seats = [];
			for(var i = 0; i < roomInfo.seats.length; ++i){
				var rs = roomInfo.seats[i];
				var online = false;
				if(rs.userId > 0){
					online = userMgr.isOnline(rs.userId);
				}

				seats.push({
					userid:rs.userId,
					ip:rs.ip,
					score:rs.score,
					name:rs.name,
					online:online,
					ready:rs.ready,
					seatindex:i
				});

				if(userId == rs.userId){
					userData = seats[i];
				}
			}

			//通知前端
			var ret = {
				errcode:0,
				errmsg:"ok",
				data:{
					roomid:roomInfo.id,
					conf:roomInfo.conf,
					numofgames:roomInfo.numOfGames,
					seats:seats
				}
			};
			socket.emit('login_result',ret);

			//通知其它客户端
			userMgr.broacastInRoom('new_user_comes_push',userData,userId);
			
			socket.gameMgr = roomInfo.gameMgr;

			//玩家上线，强制设置为TRUE
			socket.gameMgr.setReady(userId);

			socket.emit('login_finished');

			if(roomInfo.dr != null){
				var dr = roomInfo.dr;
				var ramaingTime = (dr.endTime - Date.now()) / 1000;
				var data = {
					time:ramaingTime,
					states:dr.states
				}
				userMgr.sendMsg(userId,'dissolve_notice_push',data);	
            };
        });

        //
    });
};