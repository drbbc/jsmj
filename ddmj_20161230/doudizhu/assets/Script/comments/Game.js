cc.Class({
    extends: cc.Component,

    properties: {
        nickName:cc.Label,
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

        // this.nickName = cc.find("Canvas/nickName");
        this.nickName.string = cc.vv.userMgr.userName;
        cc.log(this.nickName);
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
    },
    initSingleSeat:function(seat){
        var index = cc.vv.gameNetMgr.getLocalIndex(seat.seatindex);
        var isOffline = !seat.online;
        // var isZhuang = seat.seatindex == cc.vv.gameNetMgr.button;//
        
        console.log("isOffline:" + isOffline);
        
        this._seats[index].setInfo(seat.name,seat.score);
        this._seats[index].setReady(seat.ready);
        this._seats[index].setOffline(isOffline);
        this._seats[index].setID(seat.userid);
        this._seats[index].voiceMsg(false);
        
        this._seats2[index].setInfo(seat.name,seat.score);
        // this._seats2[index].setZhuang(isZhuang);
        this._seats2[index].setOffline(isOffline);
        this._seats2[index].setID(seat.userid);
        this._seats2[index].voiceMsg(false);
        // this._seats2[index].refreshXuanPaiState();
    },

    onTestBtnClick:function(){
        var d = {
            'begin':1,
        }
        console.log("begin---qian");
        cc.vv.net.send("test_socket",d);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
