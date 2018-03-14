eventManager = require '../event/ArkEventManager.coffee'
eventNames = require '../event/ArkEventNames.coffee'
class ArkMainDialog
    onClose: ->
        console.log("hello world")

    cc.BuilderReader.registerController(
      "ArkMainDialog"
      new ArkMainDialog()
    )

module.exports = cc.BuilderReader.load("res/main.ccbi")