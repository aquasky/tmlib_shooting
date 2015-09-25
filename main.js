tm.main(function(){
    var app = tm.display.CanvasApp("#world");   // canvasを取得
    app.resize(640, 960);                       // サイズ
    app.background = "black";           // 背景色
    app.enableStats();                  // FPSを表示
    app.fitWindow();                    // 表示領域の設定

    app.run();                          // 実行
});
