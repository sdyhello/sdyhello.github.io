eventManager = require '../event/ArkEventManager.coffee'
eventNames = require '../event/ArkEventNames.coffee'
ArkScrollView = require '../tools/ScrollView.coffee'
storage = require '../tools/storage.coffee'

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
            "ccb_advanceReceipts", "ccb_receivableTurnoverDays", "ccb_netProfitQuality", "ccb_debt"]
        for textFileName in textFileNameTable
            @["_#{textFileName}"] = @_createEditBox(@["#{textFileName}"])
            @rootNode.addChild(@["_#{textFileName}"])
        @_initEditBoxData()

    _initEditBoxData: ->
        @_ccb_stockCode.setString(storage.getItem("stockCode") or "600519")

        filterObj = storage.getItem("filterObj") or {
            profitAddRatio: "12"
            roe: "15"
            pe: "60"
            advanceReceipt: "5"
            receivableTurnoverDays: "30"
            netProfitQuality: "0.8"
            debt: "-1"
        }
        global.year = storage.getItem("years") or 6
        @_ccb_year.setString(global.year + "")
        @_ccb_profitAddRatio.setString(filterObj.profitAddRatio)
        @_ccb_roe.setString(filterObj.roe)
        @_ccb_pe.setString(filterObj.pe)
        @_ccb_advanceReceipts.setString(filterObj.advanceReceipt)
        @_ccb_receivableTurnoverDays.setString(filterObj.receivableTurnoverDays)
        @_ccb_netProfitQuality.setString(filterObj.netProfitQuality)
        @_ccb_debt.setString(filterObj.debt)

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

    _setYears: ->
        years = @_ccb_year.getString()
        global.year = years
        storage.setItem("years", years)

    onFilter: ->
        TDGA?.onEvent("onFilter")
        @_setYears()

        profitAddRatio          = @_ccb_profitAddRatio.getString()
        roe                     = @_ccb_roe.getString()
        pe                      = @_ccb_pe.getString()
        advanceReceipt          = @_ccb_advanceReceipts.getString()
        receivableTurnoverDays  = @_ccb_receivableTurnoverDays.getString()
        netProfitQuality        = @_ccb_netProfitQuality.getString()
        debt                    = @_ccb_debt.getString()

        storage.setItem("filterObj", {profitAddRatio, roe, pe, 
            advanceReceipt, receivableTurnoverDays, netProfitQuality, debt})

        eventManager.send eventNames.GAME_FILTER,
            profitAddRatio          : parseFloat(profitAddRatio)
            roe                     : parseFloat(roe)
            pe                      : parseFloat(pe)
            advanceReceipt          : parseFloat(advanceReceipt)
            receivableTurnoverDays  : parseFloat(receivableTurnoverDays)
            netProfitQuality        : parseFloat(netProfitQuality)
            debt                    : parseFloat(debt)
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
        storage.setItem("stockCode", stockCode)
        years = @_ccb_year.getString()
        TDGA?.onEvent("onCalc", {stockCode, years})
        @_setYears()
        eventManager.send eventNames.GAME_GET_RESULT,
            stockCode: stockCode
            callback: (str)=>
                @showResult(str)

    onGetIndustryAverage: ->
        eventManager.send eventNames.GAME_PERCENT_AVERAGE,
            stockCode: @_ccb_stockCode.getString()
            callback: (info)=>
                @showResult(info)

    cc.BuilderReader.registerController(
        "ArkMainDialog"
        new ArkMainDialog()
    )

module.exports = cc.BuilderReader.load("res/main.ccbi")