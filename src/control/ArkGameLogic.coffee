sceneManager    = require '../tools/ArkSceneManager.coffee'
eventManager    = require '../event/ArkEventManager.coffee'
eventNames      = require '../event/ArkEventNames.coffee'
UserData        = require '../model/ArkUserData.coffee'

BalanceSheet    = require '../model/BalanceSheet.coffee'
ProfitStatement    = require '../model/ProfitStatement.coffee'
CashFlowStatement    = require '../model/CashFlowStatement.coffee'

require "../globalValue.coffee"

g_statisticsYears = 5 #运行时重新计算
g_maxStatisticsYears = 6

needCalcItem = {
    "receivables": "应收账款(元)", #6
    "depositReceived" : "预收账款(元)",#7
    "shortLoan" : "短期借款(元)", #8
    "longLoan" : "长期借款(元)" #9
}

ARK_RETAIN_PROFITS = "归属于母公司股东的综合收益总额(元)"  #5
ARK_NET_ASSETS 	= "归属于母公司股东权益合计(元)"	#10
ARK_ROE = "净资产收益率"
ARK_RETAIN_PROFITS_ADD_RATE = "净利润同比增长率"

g_log_table = []



class GameLogic
    init: ->
        @_balanceObj = {}
        @_profitObj = {}
        @_cashFlowObj = {}
        @_registerEvents()
        @_initTable()

    _registerEvents: ->

        eventManager.listen(eventNames.GAME_GET_RESULT, (obj)=>
            obj.callback?(@_balanceObj["000858"].getCashValue())
#            g_log_table = []
#            g_maxStatisticsYears = obj.years
#            obj.callback?(@_getResult(obj.data))
        )

    _initTable: ->
        stockTable = ["SZ000001","SZ000002","SZ000008","SZ000060","SZ000063","SZ000069","SZ000100","SZ000157","SZ000166","SZ000333","SZ000338","SZ000402","SZ000413","SZ000415","SZ000423","SZ000425","SZ000503","SZ000538","SZ000540","SZ000559","SZ000568","SZ000623","SZ000625","SZ000627","SZ000630","SZ000651","SZ000671","SZ000686","SZ000709","SZ000723","SZ000725","SZ000728","SZ000738","SZ000750","SZ000768","SZ000776","SZ000783","SZ000792","SZ000826","SZ000839","SZ000858","SZ000876","SZ000895","SZ000898","SZ000938","SZ000959","SZ000961","SZ000963","SZ000983","SZ001979","SZ002007","SZ002008","SZ002024","SZ002027","SZ002044","SZ002065","SZ002074","SZ002081","SZ002142","SZ002146","SZ002153","SZ002174","SZ002202","SZ002230","SZ002236","SZ002241","SZ002252","SZ002292","SZ002294","SZ002304","SZ002310","SZ002352","SZ002385","SZ002411","SZ002415","SZ002424","SZ002426","SZ002450","SZ002456","SZ002460","SZ002465","SZ002466","SZ002468","SZ002470","SZ002475","SZ002500","SZ002508","SZ002555","SZ002558","SZ002572","SZ002594","SZ002601","SZ002602","SZ002608","SZ002624","SZ002673","SZ002714","SZ002736","SZ002739","SZ002797","SZ002831","SZ002839","SZ002841","SZ300003","SZ300015","SZ300017","SZ300024","SZ300027","SZ300033","SZ300059","SZ300070","SZ300072","SZ300122","SZ300124","SZ300136","SZ300144","SZ300251","SZ300315","SH600000","SH600008","SH600009","SH600010","SH600011","SH600015","SH600016","SH600018","SH600019","SH600021","SH600023","SH600028","SH600029","SH600030","SH600031","SH600036","SH600038","SH600048","SH600050","SH600061","SH600066","SH600068","SH600074","SH600085","SH600089","SH600100","SH600104","SH600109","SH600111","SH600115","SH600118","SH600153","SH600157","SH600170","SH600177","SH600188","SH600196","SH600208","SH600219","SH600221","SH600233","SH600271","SH600276","SH600297","SH600309","SH600332","SH600340","SH600352","SH600362","SH600369","SH600372","SH600373","SH600376","SH600383","SH600390","SH600406","SH600415","SH600436","SH600482","SH600485","SH600489","SH600498","SH600518","SH600519","SH600522","SH600535","SH600547","SH600549","SH600570","SH600583","SH600585","SH600588","SH600606","SH600637","SH600649","SH600660","SH600663","SH600674","SH600682","SH600685","SH600688","SH600690","SH600703","SH600704","SH600705","SH600739","SH600741","SH600795","SH600804","SH600816","SH600820","SH600827","SH600837","SH600871","SH600886","SH600887","SH600893","SH600895","SH600900","SH600909","SH600919","SH600926","SH600958","SH600959","SH600977","SH600999","SH601006","SH601009","SH601012","SH601018","SH601021","SH601088","SH601099","SH601111","SH601117","SH601118","SH601155","SH601163","SH601166","SH601169","SH601186","SH601198","SH601211","SH601212","SH601216","SH601225","SH601228","SH601229","SH601288","SH601318","SH601328","SH601333","SH601336","SH601375","SH601377","SH601390","SH601398","SH601555","SH601600","SH601601","SH601607","SH601608","SH601611","SH601618","SH601628","SH601633","SH601668","SH601669","SH601688","SH601718","SH601727","SH601766","SH601788","SH601800","SH601818","SH601857","SH601866","SH601872","SH601877","SH601878","SH601881","SH601888","SH601898","SH601899","SH601901","SH601919","SH601933","SH601939","SH601958","SH601966","SH601985","SH601988","SH601989","SH601991","SH601992","SH601997","SH601998","SH603160","SH603799","SH603833","SH603858","SH603993"]
        dir = "hs300"
        for stockCode in stockTable
            stockCode = stockCode.slice(2, 8)
            @_balanceObj[stockCode] = new BalanceSheet(dir, stockCode)
            @_profitObj[stockCode] = new ProfitStatement(dir, stockCode)
            @_cashFlowObj[stockCode] = new CashFlowStatement(dir, stockCode)
        return

    _getResult: (data)->
        totalScore = 0
        totalAssetsIndex = @_getTypeRowNum(data, ARK_NET_ASSETS)
        g_statisticsYears = @_getStatisticsYears(data, totalAssetsIndex)
        g_log_table.push "总资产 #{@_getShowNumber(data[totalAssetsIndex][1])}, 统计时间:#{g_statisticsYears}年"
        for own calcItem, value of needCalcItem
            totalScore += @_calcScore(data, calcItem, value, totalAssetsIndex)

        totalScore += @_getRetainedProfitsScore(data)
        totalScore += @_getRoeScore(data)
        totalScore = Math.ceil(totalScore)
        g_log_table.push "总分: #{totalScore}"
        return JSON.stringify(g_log_table, null, "\t")

    _getReceiveScore: (percent)->
        return -percent

    _getScore : (type, percent)->
        score = 0
        switch type
            when "receivables"
                score = @_getReceiveScore(percent)
            when "depositReceived"
                score = percent

        if type is "shortLoan" or type is "longLoan"
            score = 40 - percent
        return score

    _getValidNumber : (numberStr)->
        return numberStr if typeof(numberStr) is "number"
        num = numberStr.toLowerCase()
        return Number(num)

    _getTypeRowNum : (data, typeStr)->
        typeNum = 0
        for row, index in data
            if row[0].indexOf(typeStr) isnt -1
                typeNum = index
                break
        return typeNum

    _getCompoundRate: (addRate, time)->
        return Math.exp(1 / time * Math.log(addRate))


    _calcScore : (data, type, typeStr, totalAssetsIndex)->
        typeNum = @_getTypeRowNum(data, typeStr)
        totalPercent = 0
        infoTable = []
        infoTable.push data[typeNum][0]
        for yearIndex in [1..g_statisticsYears]
            break unless data[typeNum][yearIndex]?
            infoTable.push @_getShowNumber(@_getValidNumber(data[typeNum][yearIndex]))
            totalPercent += @_getValidNumber(data[typeNum][yearIndex]) / @_getValidNumber(data[totalAssetsIndex][yearIndex]) * 100
        averagePercent = totalPercent / g_statisticsYears
        score = @_getScore(type, averagePercent)
        g_log_table.push "#{infoTable}"
        g_log_table.push "#{needCalcItem[type]} 比例:#{averagePercent.toFixed(2)}%, 分数 :#{score.toFixed(2)}"
        return score

    _getStatisticsYears : (data, totalAssetsIndex)->
        totalAssets = data[totalAssetsIndex].filter((a)-> a > 0)
        length = 0
        if totalAssets.length > g_maxStatisticsYears
            length = g_maxStatisticsYears
        else
            length = totalAssets.length
        return length

    _getTableByName: (data, name)->
        rowNum = @_getTypeRowNum(data, name)
        table = data[rowNum].filter((a)-> a > 0)
        table.slice(0, g_maxStatisticsYears)

    #计算N年净利润复合增长速度得分
    _getRetainedProfitsScore:  (data)->
        @_getRetainedProfitsAddRate(data)
        allRetainedProfits = @_getTableByName(data, ARK_RETAIN_PROFITS)
        g_log_table.push "初始净利润：#{@_getShowNumber(allRetainedProfits[allRetainedProfits.length - 1])},当前净利润:#{@_getShowNumber(allRetainedProfits[0])}"
        addRetainedProfits = allRetainedProfits[0] / allRetainedProfits[allRetainedProfits.length - 1]
        averagePercent = (@_getCompoundRate(addRetainedProfits, g_statisticsYears) - 1) * 100
        g_log_table.push "#{g_statisticsYears}年,净利润复合增长速度:#{averagePercent.toFixed(2)}%"
        return averagePercent

    _getRetainedProfitsAddRate:(data) ->
        rowNum = @_getTypeRowNum(data, ARK_RETAIN_PROFITS_ADD_RATE)
        rateAddTable = []
        for rateIndex in [1..g_statisticsYears]
            rateAddTable.push data[rowNum][rateIndex]
        g_log_table.push "#{ARK_RETAIN_PROFITS_ADD_RATE}:#{rateAddTable}"

    #计算ROE得分
    _getRoeScore : (data)->
        roeRowNum = @_getTypeRowNum(data, ARK_ROE)
        totalRoe = 0
        count = 0
        roeTable = []
        for roeValue in [1..g_statisticsYears]
            continue if typeof(data[roeRowNum][roeValue]) isnt "string"
            roe = data[roeRowNum][roeValue]
            roeTable.push roe
            roe = Number(roe.replace("%", ""))
            totalRoe += roe
            count++
        g_log_table.push "ROE:#{roeTable}"
        averageRoe = totalRoe / count
        g_log_table.push "平均ROE:#{averageRoe.toFixed(2)}"
        return averageRoe

    _getShowNumber : (number)->
        return "#{(number / 100000000).toFixed(2)} 亿"

module.exports = GameLogic
