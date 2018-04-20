eventManager = require '../event/ArkEventManager.coffee'
eventNames = require '../event/ArkEventNames.coffee'

TAG_ASSETS = "totalAssets"
TAG_RECEIVABLE = "receivables"
TAG_DEPOSIT = "depositReceived"
TAG_RETAINED_PROFITS = "retainedProfits"
TAG_SHORT_LOAN = "shortLoan"
TAG_LONG_LOAN = "longLoan"

class ArkMainDialog
    onDidLoadFromCCB: ->
        @_datTable = []
        @init()

    init: ->
        @_stockCodeEditBox = @_createEditBox(@ccb_textField_1)
        @rootNode.addChild(@_stockCodeEditBox)

        @_yearsEditBox = @_createEditBox(@ccb_textField_2)
        @rootNode.addChild(@_yearsEditBox)

        @_initData()
        return

    _initData: ->
        @_stockCodeEditBox.setString("000001")
        @_yearsEditBox.setString("6")

    _createEditBox: (node)->
        editBox = new cc.EditBox(cc.size(200, 50))
        editBox.setPosition(node.getPosition())
        editBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE)
        editBox.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE)
        editBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_INITIAL_CAPS_SENTENCE)
        editBox.setMaxLength(13)
        editBox.setFont("Arial", 26)
        editBox.setFontColor(cc.color(100, 100, 255, 255))
        return editBox

    showResult: (result)->
        @ccb_result.setString(result)

    onCalc: ->
        stockCode = @_stockCodeEditBox.getString()
        years = @_yearsEditBox.getString()
        cc.loader.loadJson("res/300_json/#{stockCode}.json", (error, data)=>
            @showResult("")
            eventManager.send eventNames.GAME_GET_RESULT,
                data: data
                years : years
                callback: (str)=>
                    @showResult(str)
        )


    cc.BuilderReader.registerController(
        "ArkMainDialog"
        new ArkMainDialog()
    )

module.exports = cc.BuilderReader.load("res/main.ccbi")