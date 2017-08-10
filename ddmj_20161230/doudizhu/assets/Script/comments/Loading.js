cc.Class({
    extends: cc.Component,

    properties: {
         tipLabel:cc.Label,
        _stateStr:'',
        _progress:0.0,
        _splash:null,
        _isLoading:false,
        _errCount:0,
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
        this.initMgr();
        this.tipLabel.string = this._stateStr;
        
        // this._splash = cc.find("Canvas/splash");
        // this._splash.active = true;
    },
    initMgr:function (){
        console.log('initMgr()');
        cc.vv = {};
        var UserMgr = require("UserMgr");
        cc.vv.userMgr = new UserMgr();
        
        var ReplayMgr = require("ReplayMgr");
        cc.vv.replayMgr = new ReplayMgr();
        
        cc.vv.http = require("HTTP");
        cc.vv.global = require("Global");
        cc.vv.net = require("Net");
        
        var GameNetMgr = require("GameNetMgr");
        cc.vv.gameNetMgr = new GameNetMgr();
        cc.vv.gameNetMgr.initHandlers();
        
        var AnysdkMgr = require("AnysdkMgr");
        cc.vv.anysdkMgr = new AnysdkMgr();
        cc.vv.anysdkMgr.init();
        
        var VoiceMgr = require("VoiceMgr");
        cc.vv.voiceMgr = new VoiceMgr();
        cc.vv.voiceMgr.init();
        
        var AudioMgr = require("AudioMgr");
        cc.vv.audioMgr = new AudioMgr();
        cc.vv.audioMgr.init();
        
        var Utils = require("Utils");
        cc.vv.utils = new Utils();
        
        cc.args = this.urlParse();
    },
    
    urlParse:function(){
        var params = {};
        console.log('urlParse()');
        if(window.location == null){
            return params;
        }
        var name,value; 
        var str=window.location.href; //取得整个地址栏
        var num=str.indexOf("?") 
        str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]
        console.log(str);
        var arr=str.split("&"); //各个参数放到数组里
        for(var i=0;i < arr.length;i++){ 
            num=arr[i].indexOf("="); 
            if(num>0){ 
                name=arr[i].substring(0,num);
                value=arr[i].substr(num+1);
                params[name]=value;
            } 
        }
        
        return params;
    },
    start:function(){
      this.checkVersion();  
    },
    
    startPreloading:function(){
        this._stateStr = "正在加载资源，请稍候";
        this._isLoading = true;
        var self = this;
        
        cc.loader.onProgress = function ( completedCount, totalCount,  item ){
            //console.log("completedCount:" + completedCount + ",totalCount:" + totalCount );
            if(self._isLoading){
                self._progress = completedCount/totalCount;
            }
        };
        
        cc.loader.loadResAll("textures", function (err, assets) {
            self.onLoadComplete();
        });      
    },
    onLoadComplete:function(){
        this._isLoading = false;
        this._stateStr = "准备登陆";
        cc.director.loadScene("createrole");
        cc.loader.onComplete = null;
    },
    
    checkVersion:function(){
        var self = this;
        var onGetVersion = function(ret){
            if(ret.version == null){
                console.log("error.");
            }
            else{
                cc.vv.SI = ret;
                if(ret.version != cc.VERSION){
                    //cc.find("Canvas/alert").active = true;
                }
                else{
                    self.startPreloading();
                }
            }
        };
        
        var xhr = null;
        var complete = false;
        var fnRequest = function(){
            self._stateStr = "正在连接服务器";
            if (self._errCount >= 10){
                return;
            }
            xhr = cc.vv.http.sendRequest("/get_serverinfo",null,function(ret){
                xhr = null;
                complete = true;
                onGetVersion(ret);
            });
            setTimeout(fn,5000);            
        }
        
        var fn = function(){
            if(!complete){
                if(xhr){
                    xhr.abort();
                    self._stateStr = "连接失败，即将重试";
                    self._errCount++;
                    console.log('失败次数：'+self._errCount);
                    setTimeout(function(){
                        fnRequest();
                    },1000);
                }
                else{
                    fnRequest();
                }
            }
        };
        fn();
    },
    update: function (dt) {
        if(this._stateStr.length == 0){
            return;
        }
        this.tipLabel.string = this._stateStr + ' ';
        if(this._isLoading){
            this.tipLabel.string += Math.floor(this._progress * 100) + "%";   
        }
        else{
            var t = Math.floor(Date.now() / 1000) % 4;
            for(var i = 0; i < t; ++ i){
                this.tipLabel.string += '.';
            }            
        }
    }
});
