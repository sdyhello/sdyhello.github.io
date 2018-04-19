eventManager = require '../event/ArkEventManager.coffee'
eventNames = require '../event/ArkEventNames.coffee'
class ArkMainDialog
    onDidLoadFromCCB: ->
        textFieldLabel1 = new ccui.TextField("0000.00", 25)
        @rootNode.addChild(textFieldLabel1)
        textFieldLabel1.setPosition(@ccb_textField_1.getPosition())

        textFieldLabel2 = new ccui.TextField("0000.00", 25)
        @rootNode.addChild(textFieldLabel2)
        textFieldLabel2.setPosition(@ccb_textField_2.getPosition())
        return

    cc.BuilderReader.registerController(
        "ArkMainDialog"
        new ArkMainDialog()
    )

module.exports = cc.BuilderReader.load("res/main.ccbi")