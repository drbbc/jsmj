//游戏主逻辑
var roomMgr = require("./dz_roommgr");
var userMgr = require("./dz_usermgr");
var db = require("../utils/db");
var crypto = require("../utils/crypto");
var games = {};
var gamesIdBase = 0;

var gameSeatsOfUsers = {};

//洗牌
function flush(game){

    //
    //0 黑桃 3-15 ，1 红桃 18-30 2 方块 34-46 3 樱花 50-62
    game.paiInfoList = [3,4,5,6,7,8,9,10,11,12,13,14,15,
                18,19,20,21,22,23,24,25,26,27,28,29,
                34,35,36,37,38,39,40,41,42,43,44,45,
                50,51,52,53,54,55,56,57,58,59,60,
    ];

    paiInfoList = game.paiInfoList;
    
    for(var i = 0; i < paiInfoList.length; ++i){
        var lastIndex = paiInfoList.length - 1 - i;
        var index = Math.floor(Math.random() * lastIndex);
        var t = paiInfoList[index];
        paiInfoList[index] = paiInfoList[lastIndex];
        paiInfoList[lastIndex] = t;
    }
    
}

function fapai(game){

    if (!game.paiInfoList){
        return;
    }

    var seats = game.gameSeats;
    if (!seats || seats.length ==0){
        return;
    }
    var holds = [];
    var i = 0;
    var n = seats.length;
    for (var index = 0; index < game.paiInfoList.length; index++) {
        i = i%n;
        var pk = game.paiInfoList[index];
        if (pk === n-1){
            game.chupaiIndex = i;
        }

        if (Object.prototype.toString.call(holds[i])!=='[object Array]'){
            holds[i]=[];
        }

        holds[i].push(game.paiInfoList[index]);
        i++;
    }
    game.holds = holds;
}

function chupai(game,index){
    if (game.chupaiIndex !== index){
        return;
    }
    game.chupaiIndex = (game.chupaiIndex + 1) % game.seats.length;
}

exports.setReady = function(userId,callback){
    var roomId = roomMgr.getUserRoom(userId);
    if(roomId == null){
        return;
    }
    var roomInfo = roomMgr.getRoom(roomId);
    if(roomInfo == null){
        return;
    }

    roomMgr.setReady(userId,true);

    var game = games[roomId];
    if(game == null){
        if(roomInfo.seats.length == 4 || roomInfo.seats.length == 3){
            for(var i = 0; i < roomInfo.seats.length; ++i){
                var s = roomInfo.seats[i];
                if(s.ready == false || userMgr.isOnline(s.userId)==false){
                    return;
                }
            }
            //4个人到齐了，并且都准备好了，则开始新的一局
            exports.begin(roomId);
        }
    }
    else{
        var remainingGames = roomInfo.conf.maxGames - roomInfo.numOfGames;

        var data = {
            state:game.state,
            button:game.button,
            turn:game.chupaiIndex,
        };

        data.seats = [];
        var seatData = null;
        for(var i = 0; i < 4; ++i){
            var sd = game.gameSeats[i];
            var s = {
                userid:sd.userId,
            }
            if(sd.userId == userId){
                seatData = sd;
            }
            data.seats.push(s);
        }

        //同步整个信息给客户端
        userMgr.sendMsg(userId,'game_sync_push',data);
        //sendOperations(game,seatData,game.chuPai);
    }
}

//游戏开始
exports.begin = function(roomId){
    var room = roomMgr.getRoom(roomId);
    if (room === null){
        return;
    }
    var game = {
        chupaiIndex:0,
        pushed:[],
        gameSeats:room.seats
    };

    flush(game);
    fapai(game);

    var seats = room.seats;

    for(var i = 0; i < game.gameSeats.length; ++i){
        //开局时，通知前端必要的数据
        var s = seats[i];
        //通知玩家手牌
        userMgr.sendMsg(s.userId,'game_holds_push',game.gameSeats[i].holds);
        //通知还剩多少张牌
        userMgr.sendMsg(s.userId,'mj_count_push',numOfMJ);
        //通知还剩多少局
        userMgr.sendMsg(s.userId,'game_num_push',roomInfo.numOfGames);
        //通知游戏开始
        userMgr.sendMsg(s.userId,'game_begin_push',game.button);
    }
}

// flush(game);

// fapai(game);



// console.log(game);
