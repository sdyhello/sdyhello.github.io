sceneManager    = require '../tools/ArkSceneManager.coffee'
eventManager    = require '../event/ArkEventManager.coffee'
eventNames      = require '../event/ArkEventNames.coffee'
UserData        = require '../model/ArkUserData.coffee'


class GameLogic
    init: ->
        @_userData = new UserData()
        @_registerEvents()

    _registerEvents: ->
        eventManager.listen(eventNames.GAME_START, =>
            @_userData.setScore(0)
            @_userData.setCount(20)
            @_GameStart()
        )

        eventManager.listen(eventNames.GAME_END, =>
            sceneManager.removeTopLayer()
            dialogNode = GameEndDialog.showDialog()
            sceneManager.addLayerToScene(dialogNode)
            dialogNode.controller.init(@_userData.getScore())
        )

        eventManager.listen(eventNames.GAME_NEXT_LEVEL, =>
            sceneManager.removeTopLayer()
            @_userData.setCount(20)
            @_GameStart()
        )


    _GameStart: ->
        dialogNode = GameDialog.showDialog()
        sceneManager.addLayerToScene(dialogNode)
        dialogNode.controller.init(@_userData)


module.exports = GameLogic
