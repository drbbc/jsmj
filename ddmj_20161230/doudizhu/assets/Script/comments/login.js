cc.Class({
    extends: cc.Component,

    properties: {
        testName:cc.EditBox,
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
    //游客登录事件
    onButtonClicked:function(){
        console.log("clicked:" + this.testName.string);
        cc.vv.userMgr.create(name);
    },
    // use this for initialization
    onLoad: function () {
        
    },
    //微信登录按钮事件
    onWxButtonClicked:function(){

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
