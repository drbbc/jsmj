cc.Class({
    extends: cc.Component,

    properties: {
        
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
        // if(!cc.sys.isNative && cc.sys.isMobile){
        //     var cvs = this.node.getComponent(cc.Canvas);
        //     cvs.fitHeight = true;
        //     cvs.fitWidth = true;
        // }
        if(!cc.vv){
            cc.director.loadScene("Connect");
            return;
        }
    },
    //微信登录按钮事件
    onWxButtonClicked:function(){

    },
    //游戏登录
    onButtonClicked:function(){
        cc.vv.userMgr.guestAuth();
    },


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
