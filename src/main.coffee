cc.game.onStart = ()->
    cc.view.adjustViewPort(true);
    cc.view.setDesignResolutionSize(1136, 640, cc.ResolutionPolicy.SHOW_ALL)
    cc.view.enableAutoFullScreen(false)
    cc.view.resizeWithBrowserSize(true)
    cc.BuilderReader.setResourcePath("res/");

    require "./globalValue.coffee"

    if global.dir is "zz1000"
        preloadFileList = require "./preloadFileList.coffee"
    else
        preloadFileList = []
    cc.LoaderScene.preload(preloadFileList, =>
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