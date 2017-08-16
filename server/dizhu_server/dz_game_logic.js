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

    var seats = game.seats;
    if (!seats || seats.length ==0){
        return;
    }

    var i = 0;
    var n = seats.length;
    for (var index = 0; index < game.paiInfoList.length; index++) {
        i = i%n;
        seats[i].push(game.paiInfoList[index]);
        i++;
    }

    //game.seats = seats;
    //return game;
}

function chupai(game,index){
    if (game.chupaiIndex !== index){
        return;
    }

    
}

//Test
var game = {
    paiInfoList:[],
    seats:[
        [],
    ],
    chupaiIndex:0
}

flush(game);

fapai(game);



console.log(game);
