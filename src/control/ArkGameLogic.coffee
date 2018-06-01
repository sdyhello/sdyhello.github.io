sceneManager    = require '../tools/ArkSceneManager.coffee'
eventManager    = require '../event/ArkEventManager.coffee'
eventNames      = require '../event/ArkEventNames.coffee'
UserData        = require '../model/ArkUserData.coffee'

BalanceSheet    = require '../model/BalanceSheet.coffee'
ProfitStatement    = require '../model/ProfitStatement.coffee'
CashFlowStatement    = require '../model/CashFlowStatement.coffee'

require "../globalValue.coffee"
utils = require '../tools/utils.coffee'

g_directory = "zz1000"

class GameLogic
    init: ->
        @_balanceObj = {}
        @_profitObj = {}
        @_cashFlowObj = {}
        @_registerEvents()
        @_initTable()

    _registerEvents: ->

        eventManager.listen(eventNames.GAME_GET_RESULT, (obj)=>
            obj.callback?(@findMatchConditionStock())
        )

    _filterROE: (stockCode) ->
        roeTable = @_getROE(stockCode)
        aveRoe = utils.getAverage(roeTable)
        if aveRoe > 18
            return true
        return false

    _filterProfitAddRatio: (stockCode)->
        profitAddRatio = @_profitObj[stockCode].getNetProfitAddRatio()
        if profitAddRatio > 20
            return true
        return false

    _filterPE: (stockCode)->
        pe = @_profitObj[stockCode].getPE()
        console.log(pe, typeof(pe),  pe > 0)
        if 0 < pe < 35
            return true
        return false

    _getStockInfo: (stockCode)->
        baseInfo = @_profitObj[stockCode].getBaseInfo()
        profitAddRatio = @_profitObj[stockCode].getNetProfitAddRatio()

        roeTable = @_getROE(stockCode)
        aveRoe = utils.getAverage(roeTable)
        
        PE  = @_profitObj[stockCode].getPE()
        return utils.addTab(stockCode) + utils.addTab(baseInfo) +
            utils.addTab(profitAddRatio) + utils.addTab(aveRoe) + utils.addTab("PE:#{PE}") + "\n"

    findMatchConditionStock: ->
        matchStockTable = []
        for stockCode in utils.getStockTable(g_directory)
            stockCode = stockCode.slice(2, 8)
            console.log(stockCode)
            if @_filterROE(stockCode) and @_filterProfitAddRatio(stockCode) and @_filterPE(stockCode)
                matchStockTable.push stockCode

        stockInfoTable = ["股票代码 \t 基本信息 \t 利润复合增长率 \t 平均ROE \t PE  统计时间:#{global.year}, 总数:#{matchStockTable.length}\n"]
        for stockCode in matchStockTable
            stockInfoTable.push @_getStockInfo(stockCode)
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

    getReceivableTurnoverDays: (stockCode)->
        receivableValueTable = @_balanceObj[stockCode].getReceivableValue()
        inComeValueTable = @_profitObj[stockCode].getIncomeValue()
        daysTable = ["应收账款周转天数" + "\t"]
        console.log(receivableValueTable, inComeValueTable)
        for receivableValue, index in receivableValueTable
            break if index >= receivableValueTable.length - 1
            days = 360 / inComeValueTable[index] * (receivableValue + receivableValueTable[index + 1]) / 2
            daysTable.push days + "\t"
        return daysTable

    _initTable: ->
        for stockCode in utils.getStockTable(g_directory)
            stockCode = stockCode.slice(2, 8)
            @_balanceObj[stockCode] = new BalanceSheet(g_directory, stockCode)
            @_profitObj[stockCode] = new ProfitStatement(g_directory, stockCode)
            @_cashFlowObj[stockCode] = new CashFlowStatement(g_directory, stockCode)
        return

module.exports = GameLogic
