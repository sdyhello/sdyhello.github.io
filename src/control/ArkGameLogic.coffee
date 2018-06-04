sceneManager    = require '../tools/ArkSceneManager.coffee'
eventManager    = require '../event/ArkEventManager.coffee'
eventNames      = require '../event/ArkEventNames.coffee'
UserData        = require '../model/ArkUserData.coffee'

BalanceSheet    = require '../model/BalanceSheet.coffee'
ProfitStatement    = require '../model/ProfitStatement.coffee'
CashFlowStatement    = require '../model/CashFlowStatement.coffee'

utils = require '../tools/utils.coffee'

class GameLogic
    init: (@_dialog)->
        @_balanceObj = {}
        @_profitObj = {}
        @_cashFlowObj = {}
        @_registerEvents()
        @_initTable(global.dir)

    _registerEvents: ->
        eventManager.listen(eventNames.GAME_GET_RESULT, (options)=>
            options.callback?(@getStockDetailInfo(options.stockCode))
        )

        eventManager.listen(eventNames.GAME_FILTER, (options)=>
            profitAddRatio = options.profitAddRatio
            roe = options.roe
            pe = options.pe
            advanceReceipt = options.advanceReceipt
            receivableTurnoverDays = options.receivableTurnoverDays
            netProfitQuality = options.netProfitQuality
            options.callback?(@findMatchConditionStock(profitAddRatio, roe, pe, advanceReceipt,
              receivableTurnoverDays, netProfitQuality))
        )

    _filterAdvanceReceiptsPercent:(stockCode, advanceReceipt) ->
        percent = @_getAdvanceReceiptsPercent(stockCode)
        if percent  >= advanceReceipt
            return true
        return false

    _getAdvanceReceiptsPercent: (stockCode)->
        return @_balanceObj[stockCode].getAdvanceReceiptsPercent()

    _filterReceivableTurnoverDays: (stockCode, receivableTurnoverDays)->
        day = @_getReceivableTurnOverDays(stockCode)
        if day < receivableTurnoverDays
            return true
        return false

    _getReceivableTurnOverDays: (stockCode)->
        receivableValueTable = @_balanceObj[stockCode].getReceivableValue()
        inComeValueTable = @_profitObj[stockCode].getIncomeValue()
        daysTable = []
        for receivableValue, index in receivableValueTable
            break if index >= receivableValueTable.length - 1
            days = 360 / inComeValueTable[index] * (receivableValue + receivableValueTable[index + 1]) / 2
            daysTable.push days

        day = utils.getAverage(daysTable)
        return day

    _filterNetProfitQuality: (stockCode, netProfitQuality)->
        ratioTable = @_getNetProfitQuality(stockCode)
        aveRatio = utils.getAverage(ratioTable)
        if aveRatio > netProfitQuality
            return true
        return false

    _filterROE: (stockCode, needRoe) ->
        roeTable = @_getROE(stockCode)
        aveRoe = utils.getAverage(roeTable)
        if aveRoe > needRoe
            return true
        return false

    _filterProfitAddRatio: (stockCode, needRatio)->
        profitAddRatio = @_profitObj[stockCode].getNetProfitAddRatio()
        if profitAddRatio > needRatio
            return true
        return false

    _filterPE: (stockCode, maxPe)->
        pe = @_profitObj[stockCode].getPE()
        if 0 < pe < maxPe
            return true
        return false

    _getStockInfo: (stockCode)->
        baseInfo = @_profitObj[stockCode].getBaseInfo()
        profitAddRatio = @_profitObj[stockCode].getNetProfitAddRatio()

        roeTable = @_getROE(stockCode)
        aveRoe = utils.getAverage(roeTable)
        
        PE  = @_profitObj[stockCode].getPE()
        return utils.addTab(stockCode) + utils.addTab(baseInfo) +
            utils.addTab(profitAddRatio) + utils.addTab(aveRoe) +
            utils.addTab("PE:#{PE}") + utils.addTab(utils.getAverage(@_getNetProfitQuality(stockCode))) +
            utils.addTab("应:#{@_getReceivableTurnOverDays(stockCode)}") +
            utils.addTab("预:#{@_getAdvanceReceiptsPercent(stockCode)}") +
            utils.addTab("统计时间: " + @_balanceObj[stockCode].getExistYears()) +
            "\n"

    findMatchConditionStock:(profitAddRatio, roe, pe, advanceReceipt,receivableTurnoverDays, netProfitQuality)->
        matchStockTable = []
        for stockCode in utils.getStockTable(global.dir)
            stockCode = stockCode.slice(2, 8)
            unless @_balanceObj[stockCode]?
                console.log("loading haven't done:#{stockCode}")
                continue
            continue unless @_filterProfitAddRatio(stockCode, profitAddRatio)
            continue unless @_filterROE(stockCode, roe)
            #continue unless @_filterPE(stockCode, pe)
            continue unless @_filterAdvanceReceiptsPercent(stockCode, advanceReceipt)
            continue unless @_filterReceivableTurnoverDays(stockCode, receivableTurnoverDays)
            continue unless @_filterNetProfitQuality(stockCode, netProfitQuality)
            matchStockTable.push stockCode
        return @_getStockTableInfo(matchStockTable)

    _getStockTableInfo: (matchStockTable)->
        stockInfoTable = ["股票代码 \t 基本信息 \t 所属行业 \t 利润复合增长率 \t 平均ROE \t PE \t 应收 \t 预收 \t 现金流 \t  总数:#{matchStockTable.length}\n"]
        for stockCode in matchStockTable
            stockInfoTable.push @_getStockInfo(stockCode)
        console.log(stockInfoTable)
        return stockInfoTable

    _getROE: (stockCode)->
        netAssetsTable = @_balanceObj[stockCode].getNetAssets()
        netProfitsTable = @_profitObj[stockCode].getNetProfitTable()
        roeTable = []
        for netAssets, index in netAssetsTable
            break if index >= netAssetsTable.length - 1
            roe = ((netProfitsTable[index] / ((netAssets + netAssetsTable[index + 1]) / 2)) * 100).toFixed(2)
            roeTable.push roe + "\t"
        return roeTable

    _loadFileToObj: (stockCode)->
        @_balanceObj[stockCode] = new BalanceSheet(dir, stockCode)
        @_profitObj[stockCode] = new ProfitStatement(dir, stockCode)
        @_cashFlowObj[stockCode] = new CashFlowStatement(dir, stockCode)

    _initTable: (dir)->
        totalIndex = 0
        stockTable = utils.getStockTable(dir)
        beginTime = new Date()
        loadFile = =>
            return unless global.canLoad
            global.canLoad = false
            if totalIndex >= stockTable.length
                @_dialog.controller.rootNode.unschedule(loadFile)
                now = new Date()
                dis = now - beginTime
                @_dialog.controller.ccb_loading_label.setString("load over: use time #{dis // 1000 }s")
                return
            stockCode = stockTable[totalIndex]
            stockCode = stockCode.slice(2, 8)
            @_dialog.controller.ccb_loading_label.setString("loading ...#{stockCode}... #{totalIndex}/#{stockTable.length}")
            @_loadFileToObj(stockCode)
            totalIndex++

        @_dialog.controller.rootNode.schedule(loadFile)
        loadFile()

    getStockDetailInfo: (stockCode)->
        infoTable = []
        unless @_profitObj[stockCode]?
            @_loadFileToObj(stockCode)
            return "loadFile ok, try again!"
        infoTable.push "基本信息:   " + @_profitObj[stockCode].getBaseInfo() + "\n"
        infoTable.push "年净利润增长率:   " + @_profitObj[stockCode].getNetProfitYoy() + "\n"
        infoTable.push "净利润复合增长率:   " + @_profitObj[stockCode].getNetProfitAddRatio() + "\n"
        infoTable.push "历年ROE:   " + @_getROE(stockCode) + "平均: #{utils.getAverage(@_getROE(stockCode))}" + "\n"
        infoTable.push "PE:   " + @_profitObj[stockCode].getPE() + "\n"
        infoTable.push "现金流量比净利润:   " + @_getNetProfitQuality(stockCode) + "平均:#{utils.getAverage(@_getNetProfitQuality(stockCode))} " + "\n"
        infoTable.push "应收账款周转天数: #{@_getReceivableTurnOverDays(stockCode)} \n"
        infoTable.push "预收账款占总资产比例: #{@_getAdvanceReceiptsPercent(stockCode)}"
        console.log(infoTable)
        infoTable

    _getNetProfitQuality: (stockCode)->
        netProfitTable = @_profitObj[stockCode].getNetProfitTable()
        workCashFlowTable = @_cashFlowObj[stockCode].getWorkCashFlow()
        ratioTable = []
        for netProfit , index in netProfitTable
            ratioTable.push (workCashFlowTable[index] / netProfit).toFixed(2)
        ratioTable


module.exports = GameLogic
