eventManager = require '../event/ArkEventManager.coffee'
eventNames = require '../event/ArkEventNames.coffee'
ArkScrollView = require '../tools/ScrollView.coffee'

g_click_times = 0

class ArkMainDialog
    onDidLoadFromCCB: ->
        @_datTable = []
        @_reset()
        @init()

    _reset: ->
        @_scrollView = null
        @_stockCodeEditBox = null
        @_yearsEditBox = null

    init: ->
        @_stockCodeEditBox = @_createEditBox(@ccb_textField_1)
        @rootNode.addChild(@_stockCodeEditBox)

        @_yearsEditBox = @_createEditBox(@ccb_textField_2)
        @rootNode.addChild(@_yearsEditBox)

        @_initData()

        @_scrollView = ArkScrollView.createScrollView(@ccb_scrollView)
        @rootNode.addChild(@_scrollView)

        ArkScrollView.initFromContainer(@_scrollView, @ccb_result)
        return


    _initData: ->
        @_stockCodeEditBox.setString("000651")
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
        ArkScrollView.initFromContainer(@_scrollView, @ccb_result)
        ArkScrollView.scrollJumpToTop(@_scrollView)

    onCalc: ->
        stockCode = @_stockCodeEditBox.getString()
        years = @_yearsEditBox.getString()
        global.year = years
#        @showResult("")
        eventManager.send eventNames.GAME_GET_RESULT,
            stockCode: stockCode
            callback: (str)=>
                @showResult(str)

    cc.BuilderReader.registerController(
        "ArkMainDialog"
        new ArkMainDialog()
    )

module.exports = cc.BuilderReader.load("res/main.ccbi")