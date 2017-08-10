cc.Class({
    extends: cc.Component,

    properties: {
        createBtn:cc.Node,
        entryBtn:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        if(!cc.sys.isNative && cc.sys.isMobile){
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        if(!cc.vv){
            cc.director.loadScene("Login");
            return;
        }
        cc.vv.utils.addClickEvent(this.createBtn,this.Node,"hall","onCreateRootBtnClick");
    },

    onCreateRootBtnClick:function(){
        if(cc.vv.gameNetMgr.roomId != null){
            cc.vv.alert.show("提示","房间已经创建!\n必须解散当前房间才能创建新的房间");
            return;
        }
        console.log("onCreateRoomClicked");
        var parm = {
            uid:vv.userMgr.uid
        };

        xhr = cc.vv.http.sendRequest("/create_room",parm,function(ret){
            console.log(ret);
        });
    },

    onEntryRoomBtnClick:function(){
        console.log("onEntryRoomBtnClick");
        if(cc.vv && cc.vv.userMgr.roomData == null){
            return;
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(cc.vv && cc.vv.userMgr.roomData != null){
            cc.vv.userMgr.enterRoom(cc.vv.userMgr.roomData);
            cc.vv.userMgr.roomData = null;
        }
    },
});
