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
        @_initEditBoxNode()
        @_initScrollView()


    _initScrollView: ->
        @_scrollView = ArkScrollView.createScrollView(@ccb_scrollView)
        @rootNode.addChild(@_scrollView)
        ArkScrollView.initFromContainer(@_scrollView, @ccb_result)

    _initEditBoxNode: ->
        textFileNameTable = ["ccb_profitAddRatio", "ccb_roe", "ccb_pe", "ccb_year", "ccb_stockCode",
            "ccb_advanceReceipts", "ccb_receivableTurnoverDays", "ccb_netProfitQuality"]
        for textFileName in textFileNameTable
            @["_#{textFileName}"] = @_createEditBox(@["#{textFileName}"])
            @rootNode.addChild(@["_#{textFileName}"])
        @_initEditBoxData()

    _initEditBoxData: ->
        @_ccb_stockCode.setString("600519")
        @_ccb_year.setString(global.year + "")
        @_ccb_profitAddRatio.setString("12")
        @_ccb_roe.setString("15")
        @_ccb_pe.setString("60")
        @_ccb_advanceReceipts.setString("5")
        @_ccb_receivableTurnoverDays.setString("30")
        @_ccb_netProfitQuality.setString("0.8")

    _createEditBox: (node)->
        editBox = new cc.EditBox(cc.size(100, 50), new cc.Scale9Sprite("res/ccbResources/9_back.png"))
        editBox.setAnchorPoint(cc.p(0, 0.5))
        editBox.setPosition(node.convertToWorldSpace(cc.p(0, 0)))
        editBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE)
        editBox.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE)
        editBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_INITIAL_CAPS_SENTENCE)
        editBox.setMaxLength(13)
        editBox.setFont("Arial", 26)
        editBox.setFontColor(cc.color(0xFF, 0x34, 0xB3, 255))
        return editBox

    showResult: (result)->
        result = "load file first" if typeof(result) isnt "string" and result.length is 1
        @ccb_result.setString(result.toString())
        ArkScrollView.initFromContainer(@_scrollView, @ccb_result)
        ArkScrollView.scrollJumpToTop(@_scrollView)

    onFilter: ->
        years = @_ccb_year.getString()
        TDGA?.onEvent("onFilter")
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

    _loadFile: (dir)->
        TDGA?.onEvent(dir)
        eventManager.send eventNames.GAME_LOAD_TABLE, dir

    onLoad500: ->
        @_loadFile("zz500")

    onLoad1000: ->
        @_loadFile("zz1000")

    onLoadAll: ->
        @_loadFile("allA")

    onClear: ->
        TDGA?.onEvent("onClear")
        eventManager.send eventNames.GAME_CLEAR_OBJ

    onCalc: ->
        stockCode = @_ccb_stockCode.getString()
        years = @_ccb_year.getString()
        TDGA?.onEvent("onCalc", {stockCode, years})
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