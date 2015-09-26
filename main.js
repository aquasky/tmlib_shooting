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
    "player" : "image/player.png"
};

// ユーザデータ
tm.util.DataManager.set("userData", {
    score: 0    // スコア
});

tm.main(function(){
    var app = tm.display.CanvasApp("#world");   // canvasを取得
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);    // サイズ
    app.background = "black";           // 背景色
    app.fps = 60;                       // FPSを設定
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

        // UI部品をJSON形式で記述
        var UI_DATA = {
            LABELS: {
                children: [
                    {
                        type: "Label", name: "titleLabel",
                        x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2,
                        width: SCREEN_WIDTH,
                        text: "Title", fontSize: 64, align: "center"
                    }
                ]
            }
        };
        this.fromJSON(UI_DATA.LABELS);
    },

    // 更新
    update: function(app){
        // Zキーかタッチされた時にシーンを切替え
        if (app.keyboard.getKeyDown("Z") || app.pointing.getPointingEnd()) {
            app.replaceScene(MainScene());
        }
    }
});

// メインシーン
tm.define("MainScene", {
    superClass: "tm.app.Scene",   // 親クラス

    // 初期化
    init: function(){
        this.superInit();
        console.log("MainScene");

        // スコアのラベル
        this.ud = tm.util.DataManager.get("userData");
        this.ud.score = 0;

        // UI部品をJSON形式で記述
        var UI_DATA = {
            LABELS: {
                children: [
                    {
                        type: "Label", name: "scoreLabel",
                        x: 96, y: 32,
                        width: SCREEN_WIDTH,
                        text: "dummy", fontSize: 32, align: "center"
                    }
                ]
            }
        };
        this.fromJSON(UI_DATA.LABELS);
        this.scoreLabel.text = "Score : " + this.ud.score;

        // 自機の生成
        this.player = Player();
        this.player.position.set(SCREEN_WIDTH / 2, 860);
        this.addChild(this.player);

        // 敵のグループ
        this.enemyGroup = tm.display.CanvasElement();
        this.enemyGroup.update = function(app){
            // 30フレーム毎に敵を生成
            if (app.frame % 30 == 0) {
                var enemy = Enemy();
                enemy.position.set(Math.rand(40, app.height - 40), -20);
                this.addChild(enemy);
            }
        }
        this.addChild(this.enemyGroup);

        // 弾のグループ
        this.waitBulletTime = 0;    // 次の発射までの待ち時間
        this.bulletGroup = tm.display.CanvasElement();
        this.addChild(this.bulletGroup);
    },

    // 更新
    update: function(app){
        // 衝突判定
        for (var i = 0; i < this.enemyGroup.children.length; ++i) {
            var enemy = this.enemyGroup.children[i];
            // プレイヤーと敵
            if (this.player.isHitElement(enemy)) {
                console.log("Hit!!!");
                enemy.remove(); // 当たった敵を削除
                continue;
            }

            // 弾と敵
            for (var j = 0; j < this.bulletGroup.children.length; ++j) {
                var bullet = this.bulletGroup.children[j];
                if (enemy.isHitElement(bullet)) {
                    console.log("Bullet Hit!");
                    // 当たった敵と弾を削除
                    bullet.remove();
                    enemy.remove();

                    // スコアを更新
                    ++this.ud.score;
                    this.scoreLabel.text = "Score : " + this.ud.score;
                    break;
                }
            }
        }

        // Zキーが押されている間、弾を発射
        if (app.keyboard.getKey("Z")) {
            this.waitBulletTime = 10;
            var bullet = Bullet();
            bullet.position.set(this.player.x, this.player.y - 20);
            this.bulletGroup.addChild(bullet);
        }
        if (this.waitBulletTime > 0) {
            --this.waitBulletTime;
        }
    }
});

// プレイヤー
tm.define("Player", {
    superClass: "tm.display.Sprite",

    init: function(){
        this.superInit("player", 64, 64);
        console.log("Player");

        this.speed = 0; // 速度
        this.velocity = tm.geom.Vector2(0, 0);  // 移動ベクトル
    },

    update: function(app){
        var angle = app.keyboard.getKeyAngle();
        if (null != angle) {
            console.log(angle);
            this.velocity.setDegree(angle, 1);  // 角度からベクトル量を計算
            this.velocity.y *= -1;
            this.speed = 5;
        }

        // 移動させる
        this.position.add(tm.geom.Vector2.mul(this.velocity, this.speed));
        this.speed *= 0.7;    // 速度を少しずつ減衰させていく
    }
});

// 敵
tm.define("Enemy", {
    superClass: "tm.display.Shape",

    init: function(){
        this.superInit();
        this.setSize(80, 80);

        var c = this.canvas;
        c.setTransformCenter();
        c.setLineStyle(1.5, "round", "round");
        c.setColorStyle("white", "rgb(255, 50, 50)");
        c.fillStar(0, 0, 20, 16, 0.6);
        c.strokeStar(0, 0, 20, 16, 0.6);
    },

    update: function(app){
        this.y += 2.5;
        this.rotation -=4;

        // 画面外に出たら自身を削除
        if (this.y > (app.height + this.height)) {
            this.remove();
        }
    }
});

// 弾
tm.define("Bullet", {
    superClass: tm.display.Shape,

    init: function(){
        this.superInit();
        this.setSize(10, 10);

        var c = this.canvas;
        c.setTransformCenter();
        c.setColorStyle("white", "yellow");
        c.fillCircle(0, 0, 5);
    },

    update: function(){
        this.y -= 16;

        // 画面外に出たら自身を削除
        if (this.y <= -this.height) {
            this.remove();
        }
    }
});
