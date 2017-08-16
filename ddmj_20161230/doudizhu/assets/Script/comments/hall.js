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
            cc.director.loadScene("Connect");
            return;
        }
        //cc.vv.utils.addClickEvent(this.createBtn,this.Node,"hall","onCreateRootBtnClick");
    },

    onCreateRootBtnClick:function(){

        var self = this;
        if(cc.vv.gameNetMgr.roomId != null){
            cc.vv.alert.show("提示","房间已经创建!\n必须解散当前房间才能创建新的房间");
            return;
        }
        var onCreate = function(ret){
            if(ret.errcode !== 0){
                cc.vv.wc.hide();
                //console.log(ret.errmsg);
                if(ret.errcode == 2222){
                    //cc.vv.alert.show("提示","房卡不足，创建房间失败!");  
                }
                else{
                    //cc.vv.alert.show("提示","创建房间失败,错误码:" + ret.errcode);
                }
            }
            else{
                cc.vv.gameNetMgr.connectGameServer(ret);
            }
        };

        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            conf:'conf'
        };
        console.log(data);
        // cc.vv.wc.show("正在创建房间");
        cc.vv.http.sendRequest("/create_dz_room",data,onCreate);
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
