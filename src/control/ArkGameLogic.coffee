sceneManager    = require '../tools/ArkSceneManager.coffee'
eventManager    = require '../event/ArkEventManager.coffee'
eventNames      = require '../event/ArkEventNames.coffee'
UserData        = require '../model/ArkUserData.coffee'

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
        @_registerEvents()

    _registerEvents: ->
        eventManager.listen(eventNames.GAME_GET_RESULT, (obj)=>
            g_log_table = []
            g_maxStatisticsYears = obj.years
            obj.callback?(@_getResult(obj.data))
        )

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
