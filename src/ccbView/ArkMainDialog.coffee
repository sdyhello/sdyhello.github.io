eventManager = require '../event/ArkEventManager.coffee'
eventNames = require '../event/ArkEventNames.coffee'
class ArkMainDialog
    onClose: ->
        seq = []

        actionBy = cc.moveBy(1, cc.p(0, 200));
        actionByBack = actionBy.reverse();

        seq.push actionBy
        seq.push actionByBack

        @m_title.runAction(cc.sequence(seq))

    cc.BuilderReader.registerController(
        "ArkMainDialog"
        new ArkMainDialog()
    )

module.exports = cc.BuilderReader.load("res/main.ccbi")