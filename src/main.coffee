cc.game.onStart = ()->
    cc.view.adjustViewPort(true);
    cc.view.setDesignResolutionSize(1136, 640, cc.ResolutionPolicy.SHOW_ALL)
    cc.view.enableAutoFullScreen(false)
    cc.view.resizeWithBrowserSize(true)
    cc.BuilderReader.setResourcePath("res/");

    require "./globalValue.coffee"

    preloadFileList = require "./preloadFileList.coffee"

    preloadList = []
    if global.dir is "zz1000"
        preloadList = preloadFileList.getZz1000FileList()
    else if global.dir is "zz500"
        preloadList = preloadFileList.getZz500FileList()
        
    cc.LoaderScene.preload(preloadList, =>
        sceneManager = require "./tools/ArkSceneManager.coffee"
        sceneManager.init()

        gameDialog = require './ccbView/ArkMainDialog.coffee'
        sceneManager.addLayerToScene(gameDialog)
        console.log("game start")
        GameLogic = require './control/ArkGameLogic.coffee'
        gameLogicObj = new GameLogic()
        gameLogicObj.init()
    )

cc.game.run()