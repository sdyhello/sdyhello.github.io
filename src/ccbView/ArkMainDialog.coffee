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
        textFileNameTable = ["ccb_profitAddRatio", "ccb_roe", "ccb_pe", "ccb_year", "ccb_stockCode",
            "ccb_advanceReceipts", "ccb_receivableTurnoverDays", "ccb_netProfitQuality"]
        for textFileName in textFileNameTable
            @["_#{textFileName}"] = @_createEditBox(@["#{textFileName}"])
            @rootNode.addChild(@["_#{textFileName}"])

        @_initData()

        @_scrollView = ArkScrollView.createScrollView(@ccb_scrollView)
        @rootNode.addChild(@_scrollView)

        ArkScrollView.initFromContainer(@_scrollView, @ccb_result)
        return


    _initData: ->
        @_ccb_stockCode.setString("000651")
        @_ccb_year.setString(global.year + "")
        @_ccb_profitAddRatio.setString("15")
        @_ccb_roe.setString("15")
        @_ccb_pe.setString("60")
        @_ccb_advanceReceipts.setString("10")
        @_ccb_receivableTurnoverDays.setString("10")
        @_ccb_netProfitQuality.setString("0.8")

    _createEditBox: (node)->
        editBox = new cc.EditBox(cc.size(100, 50))
        editBox.setAnchorPoint(cc.p(0, 0.5))
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

    onFilter: ->
        years = @_ccb_year.getString()
        global.year = years
        eventManager.send eventNames.GAME_FILTER,
            profitAddRatio          : parseFloat(@_ccb_profitAddRatio.getString())
            roe                     : parseFloat(@_ccb_roe.getString())
            pe                      : parseFloat(@_ccb_pe.getString())
            advanceReceipt          : parseFloat(@_ccb_advanceReceipts.getString())
            receivableTurnoverDays  : parseFloat(@_ccb_receivableTurnoverDays.getString())
            netProfitQuality        : parseFloat(@_ccb_netProfitQuality.getString())
            callback : (str)=>
                @showResult(str)

    onCalc: ->
        stockCode = @_ccb_stockCode.getString()
        years = @_ccb_year.getString()
        global.year = years
        eventManager.send eventNames.GAME_GET_RESULT,
            stockCode: stockCode
            callback: (str)=>
                @showResult(str)

    cc.BuilderReader.registerController(
        "ArkMainDialog"
        new ArkMainDialog()
    )

module.exports = cc.BuilderReader.load("res/main.ccbi")