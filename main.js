// 定数
var SCREEN_WIDTH = 640;     // 画面の幅
var SCREEN_HEIGHT = 960;    // 画面の高さ

// 読み込みシーン時の定数
var LOADING_DEFAULT_PARAM = {
    width: 150,
    height: 150
};

// 画像
var ASSETS = {
    "circle" : "image/circle.png"
};

tm.main(function(){
    var app = tm.display.CanvasApp("#world");   // canvasを取得
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);    // サイズ
    app.background = "black";           // 背景色
    app.enableStats();                  // FPSを表示
    app.fitWindow();                    // 表示領域の設定

    // 画像を読み込んでタイトルシーンへ遷移
    app.replaceScene(LoadingScene({
        assets: ASSETS,
        nextScene: TitleScene
    }));

    app.run();                          // 実行
});

// 読み込みシーン
tm.define("LoadingScene", {
    superClass: "tm.app.Scene",   // 親クラス

    // 初期化
    init: function(param){
        this.superInit();
        console.log("LoadingScene");

        param = {}.$extend(LOADING_DEFAULT_PARAM, param);
        console.log(param);

        // 適当な魔法陣を生成
        this.ms = tm.display.Shape().setSize(param.width, param.height).addChildTo(this);
        this.ms.x = SCREEN_WIDTH / 2;
        this.ms.y = SCREEN_HEIGHT / 2;
        this.ms.radius = 30;
        this.ms.blendMode = "lighter";
        this.ms.alpha = 0;
        this.setupMagicSquare();

        // 画像の読み込み開始
        this.ms.tweener.clear().fadeIn(300).call(function(){
            if (param.assets) {
                var loader = tm.asset.Loader();

                // 読み込み完了
                loader.onload = function(){
                    // 次のシーンへ移行
                    this.ms.tweener.clear().fadeOut(300).call(function(){
                        if (param.nextScene) {
                            this.app.replaceScene(param.nextScene());
                        }
                        var e = tm.event.Event("load");
                        this.fire(e);
                    }.bind(this));
                }.bind(this);

                loader.load(param.assets);
            }
        }.bind(this));
    },

    // 更新
    update: function(app){
        this.ms.rotation -= 4;
    },

    setupMagicSquare: function(){
        var canvas = this.ms.canvas;
        canvas.setTransformCenter();
        canvas.fillStyle = "#C1DAFF";
        canvas.strokeStyle = "#C1DAFF";
        canvas.lineWidth = 2;
        canvas.strokePolygon(0, 0, this.ms.radius, 3);
        canvas.strokePolygon(0, 0, this.ms.radius, 3, 90);
        canvas.strokeCircle(0, 0, this.ms.radius);
        canvas.strokeCircle(0, 0, this.ms.radius * 0.8);
        canvas.lineWidth = 4;
        canvas.strokeCircle(0, 0, this.ms.radius * 1.15);
        var text = "Now Loading...";
        canvas.lineWidth = 3;
        for (var i = 0, len = text.length; i < len; ++i) {
            canvas.save();
            canvas.rotate(Math.degToRad(i * 10));
            canvas.translate(0, -this.radius * 1.4);
            canvas.fillText(text[i], 0, 0);
            canvas.restore();
            canvas.save();
            canvas.rotate(Math.degToRad(i * 10 + 180));
            canvas.translate(0, -this.radius * 1.4);
            canvas.fillText(text[i], 0, 0);
            canvas.restore();
        }
    }
});


// タイトルシーン
tm.define("TitleScene", {
    superClass: "tm.app.Scene",   // 親クラス

    // 初期化
    init: function(){
        this.superInit();
        console.log("TitleScene");

        // 画像を表示
        this.sprite = tm.display.Sprite("circle", 32, 32);
        this.sprite.position.set(240, 360);
        this.sprite.speed = 5;
        this.sprite.addChildTo(this);
    },

    // 更新
    update: function(app){
        // 画像を適当に動かす
        this.sprite.x += this.sprite.speed;
        if (this.sprite.x < 0 || this.sprite.x > app.width) {
            this.sprite.speed *= -1;
        }

        // Zキーかタッチされた時にシーンを切替え
        if (app.keyboard.getKeyDown("Z") || app.pointing.getPointingEnd()) {
            app.replaceScene(MainScene());
        }
    }
});

// メインシーンの生成
tm.define("MainScene", {
    superClass: "tm.app.Scene",   // 親クラス

    // 初期化
    init: function(){
        this.superInit();
        console.log("MainScene");
    },

    // 更新
    update: function(app){
        // Zキーかタッチされた時にシーンを切替え
        if (app.keyboard.getKeyDown("Z") || app.pointing.getPointingEnd()) {
            app.replaceScene(TitleScene());
        }
    }
});
