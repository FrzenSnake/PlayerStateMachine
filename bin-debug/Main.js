//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main,p=c.prototype;
    p.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    p.createGameScene = function () {
        var sky = this.createBitmapByName("bg_jpg");
        this.addChild(sky);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        var man0 = this.createBitmapByName("w0_png");
        var man1 = this.createBitmapByName("w1_png");
        var man2 = this.createBitmapByName("w2_png");
        var man3 = this.createBitmapByName("w3_png");
        var man4 = this.createBitmapByName("r0_png");
        var man5 = this.createBitmapByName("r1_png");
        var man6 = this.createBitmapByName("r2_png");
        var man3 = this.createBitmapByName("r3_png");
        var man7 = this.createBitmapByName("r4_png");
        var man8 = this.createBitmapByName("r5_png");
        var man9 = this.createBitmapByName("r6_png");
        var man10 = this.createBitmapByName("r7_png");
        var man11 = this.createBitmapByName("r8_png");
        var man12 = this.createBitmapByName("r9_png");
        var try1 = [man0, man1, man2, man3, man4, man5, man6, man7, man8, man9, man10, man11, man12];
        var rightCon = new egret.DisplayObjectContainer();
        rightCon.x = 0;
        rightCon.y = 0;
        this.addChild(rightCon);
        rightCon.addChild(try1[0]);
        var Mach = new Machine(this, rightCon, try1);
        Mach.Idel();
        sky.touchEnabled = true;
        sky.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (e) {
            Mach.setstate(Mach.Running);
            Mach.RunState(e.stageX, e.stageY);
        }, this);
    };
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    return Main;
}(egret.DisplayObjectContainer));
egret.registerClass(Main,'Main');
var Machine = (function () {
    function Machine(stage, CT, man) {
        this.container = new egret.DisplayObjectContainer();
        this.container = CT;
        this.man = man;
        this.Standing = new StandState(this);
        this.Running = new RunState(this);
        this.state = this.Standing;
        if (stage == null) {
            console.log("No picture import!");
        }
        this.stage = stage;
    }
    var d = __define,c=Machine,p=c.prototype;
    p.Idel = function () {
        this.state.Idel();
    };
    p.RunState = function (x, y) {
        this.state.ClickandRun(x, y);
    };
    p.setstate = function (state) {
        this.state = state;
    };
    p.getstate = function () {
        return (this.state);
    };
    return Machine;
}());
egret.registerClass(Machine,'Machine');
var StandState = (function () {
    function StandState(machine) {
        this.machine = machine;
        this.count = 0;
    }
    var d = __define,c=StandState,p=c.prototype;
    p.Idel = function () {
        console.log("me");
        this.timer = new egret.Timer(100, 0);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
        this.timer.start();
    };
    p.timerFunc = function (event) {
        if (this.machine.container.numChildren > 0) {
            this.machine.container.removeChildAt(0);
        }
        this.machine.container.addChild(this.machine.man[this.count]);
        this.count++;
        if (this.count >= 3) {
            this.count = 0;
        }
        if (this.machine.getstate() != this) {
            this.timer.stop();
        }
    };
    p.ClickandRun = function (x, y) {
        console.log("Exit Idel");
    };
    return StandState;
}());
egret.registerClass(StandState,'StandState',["State"]);
var RunState = (function () {
    function RunState(machine) {
        this.machine = machine;
        this.count = 4;
    }
    var d = __define,c=RunState,p=c.prototype;
    p.Idel = function () {
        console.log("What2?!");
    };
    p.ClickandRun = function (a, b) {
        var _this = this;
        this.timer = new egret.Timer(100, 0);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc2, this);
        this.timer.start();
        var tween = egret.Tween.get(this.machine.container);
        tween.to({ x: a - 99, y: b - 187 }, 1000).call(function () {
            _this.machine.setstate(_this.machine.Standing);
            _this.machine.getstate().Idel();
        });
    };
    p.timerFunc2 = function (event) {
        if (this.machine.container.numChildren > 0) {
            this.machine.container.removeChildAt(0);
        }
        this.machine.container.addChild(this.machine.man[this.count]);
        this.count++;
        if (this.count > 12) {
            this.count = 4;
        }
        if (this.machine.getstate() != this) {
            this.timer.stop();
        }
    };
    return RunState;
}());
egret.registerClass(RunState,'RunState',["State"]);
//# sourceMappingURL=Main.js.map