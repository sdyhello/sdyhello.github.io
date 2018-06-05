cc.game.onStart = ()->
    cc.view.adjustViewPort(true);
    cc.view.setDesignResolutionSize(1136, 640, cc.ResolutionPolicy.SHOW_ALL)
    cc.view.enableAutoFullScreen(false)
    cc.view.resizeWithBrowserSize(true)
    cc.BuilderReader.setResourcePath("res/");

    require "./globalValue.coffee"


    cc.LoaderScene.preload([], =>
        sceneManager = require "./tools/ArkSceneManager.coffee"
        sceneManager.init()

        gameDialog = require './ccbView/ArkMainDialog.coffee'
        sceneManager.addLayerToScene(gameDialog)

        GameLogic = require './control/ArkGameLogic.coffee'
        gameLogicObj = new GameLogic()
        gameLogicObj.init(gameDialog)
    )

cc.game.run()