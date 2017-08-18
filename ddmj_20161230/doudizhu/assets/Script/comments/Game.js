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

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
