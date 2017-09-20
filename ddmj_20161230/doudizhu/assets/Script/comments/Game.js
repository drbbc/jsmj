cc.Class({
    extends: cc.Component,

    properties: {
        nickName:cc.Label,
        _seats:[],

        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        if(!cc.sys.isNative && cc.sys.isMobile){
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        if(!cc.vv){
            cc.director.loadScene("Connect");
            return;
        }

        if (cc.vv.userMgr.userId == null){
            cc.director.loadScene("login");
        }

        let seats = cc.vv.gameNetMgr.seats;

        seats.forEach(function(element) {
            this.initSingleSeat(element);
        }, this);
        

        this.initEventHandlers();

        this.initViews();
    },

    initViews(){


    },

    initEventHandlers:function(){
        cc.vv.gameNetMgr.dataEventHandler = this.node;
        
        //初始化事件监听器
        var self = this;

        this.node.on('new_user',function(data){
            self.initSingleSeat(data.detail);
        });
        
        this.node.on('user_state_changed',function(data){
           
            self.initSingleSeat(data.detail);
        });

        this.node.on("game_sync_push",function(data){
            console.log("event:game_sync_push");
        });

        this.node.on('testAction',function(data){
            console.log("test---end"+data);
        });
    },

    initSingleSeat:function(seat){
        // {userid: 3, score: 0, name: "bbb", online: true, ready: false,score:0,seatindex:1,userid:3}
        if (!seat.online)return;
        this.setSeatString(seat.seatindex,seat.name);
    },

    setSeatString:function(index,name){
        var index = cc.vv.gameNetMgr.getLocalIndex(index);
        var seats = this.node.getChildByName("seats");
        var _seat = seats.getChildByName("seat"+index);
        _seat.getComponent(cc.Label).string = name;
    },



    onTestBtnClick:function(){
        var d = {
            begin:1,
        }
        console.log("begin---qian");
        cc.vv.net.send("ready",d);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
