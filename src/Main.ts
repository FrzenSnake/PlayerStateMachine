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
class Main extends egret.DisplayObjectContainer {


    private loadingView: LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent): void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent): void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield: egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene(): void {
        var sky: egret.Bitmap = this.createBitmapByName("bg_jpg");
        this.addChild(sky);
        var stageW: number = this.stage.stageWidth;
        var stageH: number = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        var man0:egret.Bitmap = this.createBitmapByName("w0_png");
        var man1:egret.Bitmap = this.createBitmapByName("w1_png");
        var man2:egret.Bitmap = this.createBitmapByName("w2_png");
        var man3:egret.Bitmap = this.createBitmapByName("w3_png");

        var man4:egret.Bitmap = this.createBitmapByName("r0_png");
        var man5:egret.Bitmap = this.createBitmapByName("r1_png");
        var man6:egret.Bitmap = this.createBitmapByName("r2_png");
        var man3:egret.Bitmap = this.createBitmapByName("r3_png");
        var man7:egret.Bitmap = this.createBitmapByName("r4_png");
        var man8:egret.Bitmap = this.createBitmapByName("r5_png");
        var man9:egret.Bitmap = this.createBitmapByName("r6_png");
        var man10:egret.Bitmap = this.createBitmapByName("r7_png");
        var man11:egret.Bitmap = this.createBitmapByName("r8_png");
        var man12:egret.Bitmap = this.createBitmapByName("r9_png");

    
        var try1:egret.Bitmap[]=[man0,man1,man2,man3,man4,man5,man6,man7,man8,man9,man10,man11,man12];

        var rightCon = new egret.DisplayObjectContainer();
        rightCon.x=0;
        rightCon.y=0;
        this.addChild(rightCon);
        rightCon.addChild(try1[0]);

        var Mach: Machine = new Machine(this,rightCon,try1);
        Mach.Idel();
        
        sky.touchEnabled = true;
        sky.addEventListener(egret.TouchEvent.TOUCH_BEGIN,(e)=>{
            Mach.setstate(Mach.Running);
            Mach.RunState(e.stageX,e.stageY);
        },this)
    }
 public createBitmapByName(name: string): egret.Bitmap {
        var result = new egret.Bitmap();
        var texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

}

interface State {
    Idel();
    ClickandRun(x:number,y:number);
}

class Machine {
    private state: State;
    public Standing: State;
    public Running: State;
    public stage: any;
    public container:egret.DisplayObjectContainer;
    private x:number;
    private y:number;
    public man:egret.Bitmap[];

    public constructor(stage:any,CT:egret.DisplayObjectContainer,man:egret.Bitmap[]) {
        this.container = new egret.DisplayObjectContainer();
        this.container = CT;
        this.man=man;
        this.Standing = new StandState(this);
        this.Running = new RunState(this);
        this.state = this.Standing;
        if (stage == null) {
            console.log("No picture import!")
        }
        this.stage = stage;
    }

    public Idel(): void {
        this.state.Idel();
    }
    public RunState(x:number,y:number): void {
        this.state.ClickandRun(x,y);
    }
    public setstate(state: State) {
        this.state = state;
    }
    public getstate(): State {
        return (this.state);
    }
}

class StandState implements State {
    private machine: Machine;
    private count: number;
    private timer: egret.Timer;
    

    
    public constructor(machine: Machine) {
        this.machine = machine;
        this.count = 0;
    }

    public Idel(): void {
        console.log("me");
        this.timer = new egret.Timer(100, 0);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
        this.timer.start();
    }

    private timerFunc(event: egret.Event) { 
        
            if(this.machine.container.numChildren>0){
                this.machine.container.removeChildAt(0);
            }
        this.machine.container.addChild(this.machine.man[this.count]);
        
        this.count++;
      
         if(this.count>=3)
        {
            
            this.count=0;
            
        }
        if(this.machine.getstate()!=this){
            this.timer.stop();
        }
    }
    public ClickandRun(x:number,y:number): void {
        console.log("Exit Idel");
    }
   
      
}

class RunState implements State {
    private machine: Machine;
    private count: number;
    private timer: egret.Timer;
  
 

    public constructor(machine: Machine) {
        this.machine = machine;
        this.count = 4;
    }

    public Idel(): void { 
        console.log("What2?!");
    }

    public ClickandRun(a:number,b:number): void {
        this.timer = new egret.Timer(100,0);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc2, this);
        this.timer.start();
        var tween = egret.Tween.get(this.machine.container);
        tween.to({x:a-99,y:b-187},1000).call(()=>{
            this.machine.setstate(this.machine.Standing)
            this.machine.getstate().Idel();
            })
    }
        private timerFunc2(event: egret.Event) {
            
                 if(this.machine.container.numChildren>0){
                this.machine.container.removeChildAt(0);}
            
        this.machine.container.addChild(this.machine.man[this.count]);
        this.count++;
   
        
       
          if(this.count>12)
        {
           
            this.count=4;
        }
     
      
        if(this.machine.getstate()!=this){
            this.timer.stop();
        }
    }
       
    
}