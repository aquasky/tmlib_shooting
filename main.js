var app;

tm.main(function(){
    app = tm.display.CanvasApp("#world");   // canvasを取得
    app.resize(640, 960);                   // サイズ
    app.background = "black";           // 背景色
    app.enableStats();                  // FPSを表示
    app.fitWindow();                    // 表示領域の設定

    app.replaceScene(TitleScene());     // 最初のシーンを設定
    app.run();                          // 実行
});

// タイトルシーン
(function(ns){
    ns.TitleScene = tm.createClass({
        superClass: tm.app.Scene,   // 親クラス

        // 初期化
        init: function(){
            this.superInit();
        },

        // 更新
        update: function(){
            console.log("TitleScene");
            // Zキーかタッチされた時にシーンを切替え
            if (app.keyboard.getKeyDown("Z") || app.pointing.getPointingEnd()) {
                app.replaceScene(MainScene());
            }
        }
    });
})(window);

// メインシーンの生成
(function(ns){
    ns.MainScene = tm.createClass({
        superClass: tm.app.Scene,   // 親クラス

        // 初期化
        init: function(){
            this.superInit();
        },

        // 更新
        update: function(){
            console.log("MainScene");
            // Zキーかタッチされた時にシーンを切替え
            if (app.keyboard.getKeyDown("Z") || app.pointing.getPointingEnd()) {
                app.replaceScene(TitleScene());
            }
        }
    });
})(window);
