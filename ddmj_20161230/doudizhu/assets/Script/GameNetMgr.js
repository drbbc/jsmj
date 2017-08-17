cc.Class({
    extends: cc.Component,

    properties: {
        dataEventHandler:null,
        roomId:null,
        maxNumOfGames:0,
        numOfGames:0,
        numOfMJ:0,
        seatIndex:-1,
        seats:null,
        turn:-1,
        button:-1,
        gamestate:"",
        isOver:false,
        dissoveData:null,
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },
    
    reset:function(){
        this.turn = -1;
        this.button = -1;
        this.gamestate = "";
        this.curaction = null;
        for(var i = 0; i < this.seats.length; ++i){
            this.seats[i].holds = [];
            this.seats[i].folds = [];
            this.seats[i].diangangs = [];
            this.seats[i].wangangs = [];
            this.seats[i].ready = false;
        }
    },
    
    clear:function(){
        this.dataEventHandler = null;
        if(this.isOver == null){
            this.seats = null;
            this.roomId = null;
            this.maxNumOfGames = 0;
            this.numOfGames = 0;        
        }
    },
    
    dispatchEvent(event,data){
        if(this.dataEventHandler){
            this.dataEventHandler.emit(event,data);
        }    
    },
    
    getSeatIndexByID:function(userId){
        for(var i = 0; i < this.seats.length; ++i){
            var s = this.seats[i];
            if(s.userid == userId){
                return i;
            }
        }
        return -1;
    },
    
    isOwner:function(){
        return this.seatIndex == 0;   
    },
    
    getSeatByID:function(userId){
        var seatIndex = this.getSeatIndexByID(userId);
        var seat = this.seats[seatIndex];
        return seat;
    },
    
    getSelfData:function(){
        return this.seats[this.seatIndex];
    },
    
    getLocalIndex:function(index){
        var ret = (index - this.seatIndex + 4) % 4;
        return ret;
    },
    
    // prepareReplay:function(roomInfo,detailOfGame){
    //     this.roomId = roomInfo.id;
    //     this.seats = roomInfo.seats;
    //     this.turn = detailOfGame.base_info.button;
    //     var baseInfo = detailOfGame.base_info;
    //     for(var i = 0; i < this.seats.length; ++i){
    //         var s = this.seats[i];
    //         s.seatindex = i;
    //         s.score = null;
    //         s.holds = baseInfo.game_seats[i];
    //         s.pengs = [];
    //         s.angangs = [];
    //         s.diangangs = [];
    //         s.wangangs = [];
    //         s.folds = [];
    //         console.log(s);
    //         if(cc.vv.userMgr.userId == s.userid){
    //             this.seatIndex = i;
    //         }
    //     }
    //     this.conf = {
    //         type:baseInfo.type,
    //     }
    //     if(this.conf.type == null){
    //         this.conf.type == "xzdd";
    //     }
    // },
    
    
    
    initHandlers:function(){
        var self = this;
        cc.vv.net.addHandler("login_result",function(data){
            console.log(data);
            if(data.errcode === 0){
                var data = data.data;
                self.roomId = data.roomid;
                self.conf = data.conf;
                self.maxNumOfGames = data.conf.maxGames;
                self.numOfGames = data.numofgames;
                self.seats = data.seats;
                self.seatIndex = self.getSeatIndexByID(cc.vv.userMgr.userId);
                self.isOver = false;
            }
            else{
                console.log(data.errmsg);   
            }
        });
                
        cc.vv.net.addHandler("login_finished",function(data){
            console.log("login_finished");
            cc.director.loadScene("dizhuGame");
        });

        cc.vv.net.addHandler("exit_result",function(data){
            self.roomId = null;
            self.turn = -1;
            self.dingque = -1;
            self.isDingQueing = false;
            self.seats = null;
        });
        
        cc.vv.net.addHandler("exit_notify_push",function(data){
           var userId = data;
           var s = self.getSeatByID(userId);
           if(s != null){
               s.userid = 0;
               s.name = "";
               self.dispatchEvent("user_state_changed",s);
           }
        });
        
        cc.vv.net.addHandler("dispress_push",function(data){
            self.roomId = null;
            self.turn = -1;
            self.dingque = -1;
            self.isDingQueing = false;
            self.seats = null;
        });
                
        cc.vv.net.addHandler("disconnect",function(data){
            if(self.roomId == null){
                cc.director.loadScene("hall");
            }
            else{
                if(self.isOver == false){
                    cc.vv.userMgr.oldRoomId = self.roomId;
                    self.dispatchEvent("disconnect");                    
                }
                else{
                    self.roomId = null;
                }
            }
        });
        
        cc.vv.net.addHandler("new_user_comes_push",function(data){
            //console.log(data);
            var seatIndex = data.seatindex;
            if(self.seats[seatIndex].userid > 0){
                self.seats[seatIndex].online = true;
            }
            else{
                data.online = true;
                self.seats[seatIndex] = data;
            }
            self.dispatchEvent('new_user',self.seats[seatIndex]);
        });
        
        cc.vv.net.addHandler("user_state_push",function(data){
            //console.log(data);
            var userId = data.userid;
            var seat = self.getSeatByID(userId);
            seat.online = data.online;
            self.dispatchEvent('user_state_changed',seat);
        });
        
        cc.vv.net.addHandler("user_ready_push",function(data){
            //console.log(data);
            var userId = data.userid;
            var seat = self.getSeatByID(userId);
            seat.ready = data.ready;
            self.dispatchEvent('user_state_changed',seat);
        });
        
        cc.vv.net.addHandler("game_holds_push",function(data){
            var seat = self.seats[self.seatIndex]; 
            console.log(data);
            seat.holds = data;
            
            for(var i = 0; i < self.seats.length; ++i){
                var s = self.seats[i]; 
                if(s.folds == null){
                    s.folds = [];
                }
                if(s.pengs == null){
                    s.pengs = [];
                }
                if(s.angangs == null){
                    s.angangs = [];
                }
                if(s.diangangs == null){
                    s.diangangs = [];
                }
                if(s.wangangs == null){
                    s.wangangs = [];
                }
                s.ready = false;
            }
            self.dispatchEvent('game_holds');
        });
         
        cc.vv.net.addHandler("game_begin_push",function(data){
            console.log('game_action_push');
            console.log(data);
            self.button = data;
            self.turn = self.button;
            self.gamestate = "begin";
            self.dispatchEvent('game_begin');
        });
        
        cc.vv.net.addHandler("game_playing_push",function(data){
            console.log('game_playing_push'); 
            self.gamestate = "playing"; 
            self.dispatchEvent('game_playing');
        });
        
        cc.vv.net.addHandler("game_sync_push",function(data){
            console.log("game_sync_push");
            console.log(data);
            self.numOfMJ = data.numofmj;
            self.gamestate = data.state;
            if(self.gamestate == "dingque"){
                self.isDingQueing = true;
            }
            else if(self.gamestate == "huanpai"){
                self.isHuanSanZhang = true;
            }
            self.turn = data.turn;
            self.button = data.button;
            self.chupai = data.chuPai;
            self.huanpaimethod = data.huanpaimethod;
            for(var i = 0; i < 4; ++i){
                var seat = self.seats[i];
                var sd = data.seats[i];
                seat.holds = sd.holds;
                seat.folds = sd.folds;
                seat.angangs = sd.angangs;
                seat.diangangs = sd.diangangs;
                seat.wangangs = sd.wangangs;
                seat.pengs = sd.pengs;
                seat.dingque = sd.que;
                seat.hued = sd.hued; 
                seat.iszimo = sd.iszimo;
                seat.huinfo = sd.huinfo;
                seat.huanpais = sd.huanpais;
                if(i == self.seatIndex){
                    self.dingque = sd.que;
                }
           }
        });
        
        
        
        cc.vv.net.addHandler("game_num_push",function(data){
            self.numOfGames = data;
            self.dispatchEvent('game_num',data);
        });

        cc.vv.net.addHandler("game_over_push",function(data){
            console.log('game_over_push');
            var results = data.results;
            for(var i = 0; i <  self.seats.length; ++i){
                self.seats[i].score = results.length == 0? 0:results[i].totalscore;
            }
            self.dispatchEvent('game_over',results);
            if(data.endinfo){
                self.isOver = true;
                self.dispatchEvent('game_end',data.endinfo);    
            }
            self.reset();
            for(var i = 0; i <  self.seats.length; ++i){
                self.dispatchEvent('user_state_changed',self.seats[i]);    
            }
        });
        
        cc.vv.net.addHandler("chat_push",function(data){
            self.dispatchEvent("chat_push",data);    
        });
        
        cc.vv.net.addHandler("quick_chat_push",function(data){
            self.dispatchEvent("quick_chat_push",data);
        });
        
        cc.vv.net.addHandler("emoji_push",function(data){
            self.dispatchEvent("emoji_push",data);
        });
        
        cc.vv.net.addHandler("dissolve_notice_push",function(data){
            console.log("dissolve_notice_push"); 
            console.log(data);
            self.dissoveData = data;
            self.dispatchEvent("dissolve_notice",data);
        });
        
        cc.vv.net.addHandler("dissolve_cancel_push",function(data){
            self.dissoveData = null;
            self.dispatchEvent("dissolve_cancel",data);
        });
        
        cc.vv.net.addHandler("voice_msg_push",function(data){
            self.dispatchEvent("voice_msg",data);
        });
    },
    
    connectGameServer:function(data){
        this.dissoveData = null;
        cc.vv.net.ip = data.ip + ":" + data.port;
        console.log(cc.vv.net.ip);
        var self = this;

        var onConnectOK = function(){
            console.log("onConnectOK");
            var sd = {
                token:data.token,
                roomid:data.roomid,
                time:data.time,
                sign:data.sign,
            };
            cc.vv.net.send("login",sd);
        };
        
        var onConnectFailed = function(){
            console.log("failed.");
            cc.vv.wc.hide();
        };
        //cc.vv.wc.show("正在进入房间");
        cc.vv.net.connect(onConnectOK,onConnectFailed);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
