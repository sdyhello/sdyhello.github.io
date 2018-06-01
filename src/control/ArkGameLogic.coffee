sceneManager    = require '../tools/ArkSceneManager.coffee'
eventManager    = require '../event/ArkEventManager.coffee'
eventNames      = require '../event/ArkEventNames.coffee'
UserData        = require '../model/ArkUserData.coffee'

BalanceSheet    = require '../model/BalanceSheet.coffee'
ProfitStatement    = require '../model/ProfitStatement.coffee'
CashFlowStatement    = require '../model/CashFlowStatement.coffee'

utils = require '../tools/utils.coffee'

class GameLogic
    init: ->
        @_balanceObj = {}
        @_profitObj = {}
        @_cashFlowObj = {}
        @_registerEvents()
        @_initTable()

    _registerEvents: ->
        eventManager.listen(eventNames.GAME_GET_RESULT, (options)=>
            options.callback?(@getStockDetailInfo(options.stockCode))
        )

        eventManager.listen(eventNames.GAME_FILTER, (options)=>
            profitAddRatio = options.profitAddRatio
            roe = options.roe
            pe = options.pe
            options.callback?(@findMatchConditionStock(profitAddRatio, roe, pe))
        )

    _filterAdvance: (stockCode)->
        count = @_balanceObj[stockCode].getAdvanceReceiptsAddCount()
        if global.year - count <= 2
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
        console.log(pe, typeof(pe),  pe > 0)
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
            utils.addTab("PE:#{PE}") + utils.addTab(utils.getAverage(@_getNetProfitQuality(stockCode))) + "\n"

    findMatchConditionStock:(profitAddRatio, roe, pe) ->
        matchStockTable = []
        for stockCode in utils.getStockTable(global.dir)
            stockCode = stockCode.slice(2, 8)
            continue unless @_filterROE(stockCode, roe)
            continue unless @_filterProfitAddRatio(stockCode, profitAddRatio)
            continue unless @_filterPE(stockCode, pe)
            continue unless @_filterAdvance(stockCode)
            continue unless @_filterReceivableTurnoverDays(stockCode)
            continue unless @_filterNetProfitQuality(stockCode)
            matchStockTable.push stockCode
        return @_getStockTableInfo(matchStockTable)

    _getStockTableInfo: (matchStockTable)->
        stockInfoTable = ["股票代码 \t 基本信息 \t 所属行业 \t 利润复合增长率 \t 平均ROE \t PE 现金流 \t 统计时间:#{global.year}, 总数:#{matchStockTable.length}\n"]
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

    _filterReceivableTurnoverDays: (stockCode)->
        receivableValueTable = @_balanceObj[stockCode].getReceivableValue()
        inComeValueTable = @_profitObj[stockCode].getIncomeValue()
        daysTable = []
        for receivableValue, index in receivableValueTable
            break if index >= receivableValueTable.length - 1
            days = 360 / inComeValueTable[index] * (receivableValue + receivableValueTable[index + 1]) / 2
            daysTable.push days

        day = utils.getAverage(daysTable)
        if day < 30
            return true
        return false

    _initTable: ->
        for stockCode, index in utils.getStockTable(global.dir)
            stockCode = stockCode.slice(2, 8)
            @_balanceObj[stockCode] = new BalanceSheet(global.dir, stockCode)
            @_profitObj[stockCode] = new ProfitStatement(global.dir, stockCode)
            @_cashFlowObj[stockCode] = new CashFlowStatement(global.dir, stockCode)
        return

    getStockDetailInfo: (stockCode)->
        infoTable = []
        unless @_profitObj[stockCode]?
            return infoTable
        infoTable.push "基本信息:   " + @_profitObj[stockCode].getBaseInfo() + "\n"
        infoTable.push "年净利润增长率:   " + @_profitObj[stockCode].getNetProfitYoy() + "\n"
        infoTable.push "净利润复合增长率:   " + @_profitObj[stockCode].getNetProfitAddRatio() + "\n"
        infoTable.push "历年ROE:   " + @_getROE(stockCode) + "\n"
        infoTable.push "平均ROE:   " + utils.getAverage(@_getROE(stockCode)) + "\n"
        infoTable.push "PE:   " + @_profitObj[stockCode].getPE() + "\n"
        infoTable.push "现金流量比净利润:   " + @_getNetProfitQuality(stockCode) + "\n"
        console.log(infoTable)
        infoTable

    filterAdvanceReceiptsAddStock: ->
        matchStockTable = []
        for stockCode, index in utils.getStockTable(global.dir)
            stockCode = stockCode.slice(2, 8)
            count = @_balanceObj[stockCode].getAdvanceReceiptsAddCount()
            if @_balanceObj[stockCode].getExistYears() - count <= 1
                matchStockTable.push stockCode
        return @_getStockTableInfo(matchStockTable)

    _getNetProfitQuality: (stockCode)->
        netProfitTable = @_profitObj[stockCode].getNetProfitTable()
        workCashFlowTable = @_cashFlowObj[stockCode].getWorkCashFlow()
        ratioTable = []
        for netProfit , index in netProfitTable
            ratioTable.push (workCashFlowTable[index] / netProfit).toFixed(2)
        ratioTable

    _filterNetProfitQuality: (stockCode)->
        ratioTable = @_getNetProfitQuality(stockCode)
        aveRatio = utils.getAverage(ratioTable)
        if aveRatio > 0.8
            return true
        return false

module.exports = GameLogic
