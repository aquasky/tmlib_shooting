tm.main(function(){
    var app = tm.display.CanvasApp("#world");   // canvasを取得
    app.resize(640, 960);                       // サイズ
    app.background = "black";           // 背景色
    app.enableStats();                  // FPSを表示
    app.fitWindow();                    // 表示領域の設定

    // タイトルシーンの生成
    var titleScene = tm.app.Scene();
    titleScene.update = function(){
        console.log("titleScene");
        // Zキーかタッチされた時にシーンを切替え
        if (app.keyboard.getKeyDown("Z") || app.pointing.getPointingEnd()) {
            app.replaceScene(mainScene);
        }
    }

    // メインシーンの生成
    var mainScene = tm.app.Scene();
    mainScene.update = function(){
        console.log("mainScene");
        if (app.keyboard.getKeyDown("Z") || app.pointing.getPointingEnd()) {
            app.replaceScene(titleScene);
        }
    }


    app.replaceScene(titleScene);       // 最初のシーンを設定
    app.run();                          // 実行
});
