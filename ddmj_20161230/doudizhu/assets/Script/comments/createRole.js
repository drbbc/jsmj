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


        
        // this._splash = cc.find("Canvas/splash");
        // this._splash.active = true;
    },
    //
    onButtonClicked:function(){
        console.log("clicked:" + this.testName.string);
        cc.vv.userMgr.create(this.testName.string);
    },
});
