sceneManager    = require '../tools/ArkSceneManager.coffee'
eventManager    = require '../event/ArkEventManager.coffee'
eventNames      = require '../event/ArkEventNames.coffee'
UserData        = require '../model/ArkUserData.coffee'

g_statisticsYears = 5 #运行时重新计算
maxStatisticsYears = 6
needShowLog = "need"

needCalcItem = {
    "totalAssets",
    "receivables",
    "retainedProfits",
    "depositReceived",
    "shortLoan",
    "longLoan"
}

g_log_table = []

if needShowLog is "need"
    DEBUG = console.log.bind(console)
else
    DEBUG = ->

class GameLogic
    init: ->
        @_registerEvents()


    _registerEvents: ->
        eventManager.listen(eventNames.GAME_GET_RESULT, (obj)=>
            g_log_table = []
            obj.callback?(@_getResult(obj.data))
        )

    _getResult: (data)->
        totalScore = 0
        totalAssetsIndex = @_getTypeRowNum(data, needCalcItem.totalAssets)
        g_statisticsYears = @_getStatisticsYears(data, totalAssetsIndex)
        g_log_table.push "totalAssetsIndex #{totalAssetsIndex}, statisticsYears:#{g_statisticsYears}"
        DEBUG("totalAssetsIndex #{totalAssetsIndex}, statisticsYears:#{g_statisticsYears}")
        for own calcItem, value of needCalcItem
            continue if value in ["totalAssets", "retainedProfits"]
            totalScore += @_calcScore(data, calcItem, value, totalAssetsIndex)

        totalScore += @_getRetainedProfitsScore(data)
        totalScore += @_getRoeScore(data)
        totalScore = Math.ceil(totalScore)
        g_log_table.push "totalScore: #{totalScore}"
        console.log("totalScore: #{totalScore}")
        return JSON.stringify(g_log_table)

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
        g_log_table.push "#{data[typeNum][0]}, #{data[typeNum][1]}"
        DEBUG(data[typeNum][0], data[typeNum][1], typeNum)
        totalPercent = 0
        for yearIndex in [1..g_statisticsYears]
            break unless data[typeNum][yearIndex]?
            totalPercent += @_getValidNumber(data[typeNum][yearIndex]) / @_getValidNumber(data[totalAssetsIndex][yearIndex]) * 100
        averagePercent = totalPercent / g_statisticsYears
        score = @_getScore(type, averagePercent)
        g_log_table.push "#{needCalcItem[type]} percent:#{averagePercent.toFixed(2)}%, score :#{score.toFixed(2)}"
        DEBUG("#{needCalcItem[type]} percent:#{averagePercent.toFixed(2)}%, score :#{score.toFixed(2)}")
        return score

    _getStatisticsYears : (data, totalAssetsIndex)->
        totalAssets = data[totalAssetsIndex].filter((a)-> a > 0)
        length = 0
        if totalAssets.length > maxStatisticsYears
            length = maxStatisticsYears
        else
            length = totalAssets.length
        return length

    _getTableByName: (data, name)->
        rowNum = @_getTypeRowNum(data, name)
        table = data[rowNum].filter((a)-> a > 0)
        table.slice(0, maxStatisticsYears)

    #计算N年净利润复合增长速度得分
    _getRetainedProfitsScore:  (data)->
        allRetainedProfits = @_getTableByName(data, needCalcItem.retainedProfits)
        g_log_table.push "初始净利润：#{allRetainedProfits[allRetainedProfits.length - 1]}, 当前净利润:#{allRetainedProfits[0]}"
        DEBUG("初始净利润：#{allRetainedProfits[allRetainedProfits.length - 1]}, 当前净利润:#{allRetainedProfits[0]}")
        addRetainedProfits = allRetainedProfits[0] / allRetainedProfits[allRetainedProfits.length - 1]
        averagePercent = (@_getCompoundRate(addRetainedProfits, g_statisticsYears) - 1) * 100
        g_log_table.push "净利润复合增长速度:#{JSON.stringify(averagePercent)}"
        DEBUG("净利润复合增长速度:#{JSON.stringify(averagePercent)}")
        return averagePercent

    #计算ROE得分
    _getRoeScore : (data)->
        retainedProfitsRowNum = @_getTypeRowNum(data, needCalcItem.retainedProfits)
        allNetAssets = @_getTableByName(data, needCalcItem.totalAssets)
        totalRoe = 0
        for netAsset, index in allNetAssets
            break if index is allNetAssets.length - 1
            roe = data[retainedProfitsRowNum][index + 1] / ((@_getValidNumber(netAsset) + @_getValidNumber(allNetAssets[index + 1])) / 2) * 100
            totalRoe += roe
            g_log_table.push "roe:#{roe.toFixed(2)}"
            DEBUG("roe:#{roe.toFixed(2)}")
        if allNetAssets.length is 1
            g_log_table.push "averageRoe :#{totalRoe.toFixed(2)}"
            DEBUG("averageRoe :#{totalRoe.toFixed(2)}")
            return totalRoe
        averageRoe = totalRoe / (allNetAssets.length - 1)
        g_log_table.push "averageRoe :#{averageRoe.toFixed(2)}"
        DEBUG("averageRoe :#{averageRoe.toFixed(2)}")
        return averageRoe

module.exports = GameLogic
