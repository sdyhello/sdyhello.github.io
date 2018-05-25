async   = require 'async'
fs      = require 'fs'
parse   = require('csv').parse
argv    = require('yargs').argv

checkFileComplete = argv.c

nameTable = require "./nameTable.coffee"
title = require "./title.coffee"

needCalcItem = {
    "receivables": "应收账款(元)", #6
    "depositReceived" : "预收账款(元)",#7
    "shortLoan" : "短期借款(元)", #8
    "longLoan" : "长期借款(元)" #9
}

g_needScore = {
	"loan": 0
	"profitsAddRate": 25
	"roe": 25
	"money": 100
}

ARK_RETAIN_PROFITS = "净利润(元)"  #5
ARK_NET_ASSETS 	= "归属于母公司股东权益合计(元)"	#10
ARK_ROE = "净资产收益率"
ARK_RETAIN_PROFITS_ADD_RATE = "净利润同比增长率"
ARK_MONEY = "经营现金流量净额(元)"
ARK_MAO_RATE = "销售毛利率"

g_statisticsYears = 5 #运行时重新计算
g_maxStatisticsYears = 6
g_filter_score = 220
g_allScore = {}
g_curReadFileCount = 0
g_totalFileCount = 0

g_directory = "300"

DEBUG = console.log.bind(console)

parseCsv = (path, callback)->
    data = fs.readFileSync path, { encoding: 'utf-8' }
    parse data, {delimiter: ','}, (error, table)->
        throw new Error(error) if error?
        callback?(table)

getReceiveScore = (percent)->
	-percent

getScore = (type, percent)->
	score = 0
	switch type
		when "receivables"
			score = getReceiveScore(percent)
		when "depositReceived"
			score = percent

	if type is "shortLoan" or type is "longLoan"
		score = 40 - percent
	return score

getTypeRowNum = (data, typeStr)->
	typeNum = 0
	for row, index in data
		if row[0].indexOf(typeStr) isnt -1
			typeNum = index
			break
	return typeNum

getValidNumber = (numberStr)->
	return numberStr if typeof(numberStr) is "number"
	num = numberStr.toLowerCase()
	return Number(num)

getShowNumber = (number)->
	return "#{(number / 100000000).toFixed(2)} 亿"

getCompoundRate= (addRate, time)->
	return Math.exp(1 / time * Math.log(addRate))

getTableByName = (data, name)->
	rowNum = getTypeRowNum(data, name)
	table = data[rowNum]
	table.slice(1, g_maxStatisticsYears + 1)

calcScore = (data, type, typeStr, totalAssetsIndex)->
	typeNum = getTypeRowNum(data, typeStr)
	totalPercent = 0
	infoTable = []
	infoTable.push data[typeNum][0]
	for yearIndex in [1..g_statisticsYears]
		break unless data[typeNum][yearIndex]?
		infoTable.push getShowNumber(getValidNumber(data[typeNum][yearIndex]))
		totalPercent += getValidNumber(data[typeNum][yearIndex]) / getValidNumber(data[totalAssetsIndex][yearIndex]) * 100
	# DEBUG("#{infoTable}")
	averagePercent = totalPercent / g_statisticsYears
	score = getScore(type, averagePercent)
	console.log("#{needCalcItem[type]} percent:#{averagePercent.toFixed(2)}%, score :#{score}")
	return score

getStatisticsYears = (data, totalAssetsIndex)->
	totalAssets = data[totalAssetsIndex].filter((a)-> a > 0)
	length = 0
	if totalAssets.length > g_maxStatisticsYears
		length = g_maxStatisticsYears
	else
		length = totalAssets.length
	return length

getRetainedProfitsAddRate = (data) ->
	rowNum = getTypeRowNum(data, ARK_RETAIN_PROFITS_ADD_RATE)
	rateAddTable = []
	for rateIndex in [1..g_statisticsYears]
		rateAddTable.push data[rowNum][rateIndex]
	DEBUG "#{ARK_RETAIN_PROFITS_ADD_RATE}:#{rateAddTable}"

getRetainedProfitsScore= (data)->
	getRetainedProfitsAddRate(data)
	allRetainedProfits = getTableByName(data, ARK_RETAIN_PROFITS)
	DEBUG "初始净利润：#{getShowNumber(allRetainedProfits[allRetainedProfits.length - 1])},当前净利润:#{getShowNumber(allRetainedProfits[0])}"
	addRetainedProfits = allRetainedProfits[0] / allRetainedProfits[allRetainedProfits.length - 1]
	averagePercent = (getCompoundRate(addRetainedProfits, g_statisticsYears) - 1) * 100
	DEBUG "#{g_statisticsYears}年,净利润复合增长速度:#{averagePercent.toFixed(2)}%"
	return averagePercent

replaceCharString = (data)->
	infoString = title.getMoneyTitle()
	console.log(infoString)
	
	for item, index in data
		item[0] = infoString[index]
		for value, count in item
			if value is "--"
				item[count] = 0

	return

addStockInfo= (data, stockInfo)->
	data.push stockInfo[g_curReadFileCount + 1]

getMoneyScore = (data)->
	allRetainedProfits = getTableByName(data, ARK_RETAIN_PROFITS)
	allMoneyTable = getTableByName(data, ARK_MONEY)
	totalMoney = 0
	totalProfit = 0
	for index in [0...g_statisticsYears]
		totalProfit += getValidNumber(allRetainedProfits[index])
		totalMoney += getValidNumber(allMoneyTable[index])
		#DEBUG("rate one year :#{rateOneYear}")

	rate = totalMoney / totalProfit * 100
	DEBUG("money rate :#{rate}")
	return rate

getTotalScore = (scoreObj)->
	totalScore = 0
	for key, value of scoreObj
		continue if key is "stockInfo"
		totalScore += value
	return totalScore

analysisStatement = (fileName)->
	parseCsv(fileName,
		(data)->
			console.log("-----------------#{fileName} info: -----------------")
			
			replaceCharString(data)
			console.log(JSON.stringify data)
			stockInfo = getStockInfoTable()
			addStockInfo(data, stockInfo)
			fs.writeFileSync "./#{g_directory}_json/#{fileName.slice(6, 12)}.json", JSON.stringify(data)
			loanScore = 0
			totalAssetsIndex = getTypeRowNum(data, ARK_NET_ASSETS)
			g_statisticsYears = getStatisticsYears(data, totalAssetsIndex)
			stockInfoStr = "#{stockInfo[g_curReadFileCount + 1][1]}, 所属于行业：#{stockInfo[g_curReadFileCount + 1][3]}, 总市值:#{getShowNumber(getValidNumber(stockInfo[g_curReadFileCount + 1][4]))}"
			DEBUG stockInfoStr
			DEBUG "最新时间：#{data[1][1]}, 总资产 #{getShowNumber(data[totalAssetsIndex][1])}, 统计时间:#{g_statisticsYears}年"
			scoreObj = {}
			scoreObj["stockInfo"] = stockInfoStr
			for own calcItem, value of needCalcItem
				loanScore +=calcScore(data, calcItem, value, totalAssetsIndex)
			scoreObj["loan"] = loanScore
			scoreObj["profitsAddRate"] = getRetainedProfitsScore(data)
			scoreObj["roe"] = getRoeScore(data, ARK_ROE)
			scoreObj["maoRate"] = getRoeScore(data, ARK_MAO_RATE)
			scoreObj["money"] = getMoneyScore(data)
			totalScore = getTotalScore(scoreObj)
			scoreObj["totalScore"] = totalScore
			scoreObj.name = fileName
			g_allScore[fileName] = scoreObj
			g_curReadFileCount++
			#filterScore()
			filterTotalScore()
	)

#计算ROE得分
getRoeScore = (data, type)->
	roeRowNum = getTypeRowNum(data, type)
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
	DEBUG "#{type}:#{roeTable}"
	averageRoe = totalRoe / count
	DEBUG "平均 #{type}:#{averageRoe.toFixed(2)}"
	return averageRoe

filterScore = ->
	return if g_totalFileCount isnt g_curReadFileCount
	filterItem = {}
	for fileName, scoreObj of g_allScore
		count = 0
		for itemName, score of scoreObj
			if score >= g_needScore[itemName]
				filterItem[itemName] = score
				count++
		if count is 4
			filterItem[fileName] = scoreObj
			console.log(filterItem[fileName].name)

filterTotalScore = ->
	return if g_totalFileCount isnt g_curReadFileCount
	filterItem = {}
	for fileName, scoreObj of g_allScore
		if scoreObj["totalScore"] >= g_filter_score
			filterItem[fileName] = scoreObj
			console.log(filterItem[fileName].name)

getStockInfoTable = ->
	table = []
	if g_directory is "300"
		table = nameTable.getName300()
	else
		table = nameTable.getName500()
	return table

# if checkFileComplete
# 	fs.readdir("./ready",
# 		(err, files)->
# 			stockInfoTable = getStockInfoTable()
# 			noStockTable = []
# 			for stockInfo in stockInfoTable
# 				existStock = stockInfo[0].slice(2, 8)
# 				isFindStock = false
# 				for fileName in files
# 					stockCode = fileName.slice(0, 6)
# 					if stockCode is existStock
# 						isFindStock = true 
# 				unless isFindStock
# 					noStockTable.push existStock		
# 			console.log("no find stock num：#{noStockTable.length}:#{noStockTable}")
# 	)
# else
# 	fs.readdir("./#{g_directory}",
# 	(err, files)->
# 		g_totalFileCount = files.length
# 		for fileName in files
# 			if fileName.indexOf(".csv") isnt -1
# 				analysisStatement("./#{g_directory}/#{fileName}")
# )

analysisStatement("lrb_000858.csv")