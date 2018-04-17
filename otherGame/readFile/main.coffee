async   = require 'async'
fs      = require 'fs'
parse   = require('csv').parse

statisticsYears = 5 #运行时重新计算

needCalcItem = {
	"receivables": "应收账款",
	"depositReceived" : "预收款项",
	"shortLoan" : "短期借款",
	"longLoan" : "长期借款"
}

parseCsv = (path, callback)->
    data = fs.readFileSync path, { encoding: 'utf-8' }
    parse data, {delimiter: ','}, (error, table)->
        throw new Error(error) if error?
        callback?(table)

getReceiveScore = (percent)->
	if 0 <= percent < 1
		10
	else if 1 <= percent < 2
		8
	else if 2 <= percent < 4
		6
	else if 4 <= percent < 6
		4
	else if 6 <= percent < 8
		2
	else
		1

getScore = (type, percent)->
	score = 0
	switch type
		when "receivables"
			score = getReceiveScore(percent)
		when "depositReceived"
			score = percent * 10

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

calcScore = (data, type, typeStr, totalAssetsIndex)->
	typeNum = getTypeRowNum(data, typeStr)
	totalPercent = 0
	for yearIndex in [1..statisticsYears]
		break unless data[typeNum][yearIndex]?
		totalPercent += Number(data[typeNum][yearIndex]) / Number(data[totalAssetsIndex][yearIndex]) * 100
	averagePercent = totalPercent / statisticsYears
	score = getScore(type, averagePercent)
	console.log("#{needCalcItem[type]} percent:#{averagePercent.toFixed(2)}%, score :#{score}")
	return score

getStatisticsYears = (data, totalAssetsIndex)->
	totalAssets = data[totalAssetsIndex].filter((a)-> a > 0)
	return totalAssets.length

#计算N年净利润平均增长速度得分
getRetainedProfitsScore=  (data)->
	retainedProfitsRowNum = getTypeRowNum(data, "归属于母公司所有者的净利润")
	allRetainedProfits = data[retainedProfitsRowNum].filter((a)-> a > 0)
	console.log("profits:#{JSON.stringify(allRetainedProfits)}")
	totalPercent = 0
	for retainedProfits, index in allRetainedProfits
		continue if index is 0
		percent = (retainedProfits - allRetainedProfits[index - 1]) / allRetainedProfits[index - 1]
		console.log(percent.toFixed(2) * 100)
		totalPercent += percent
	averagePercent = totalPercent / (allRetainedProfits.length - 1) * 100
	console.log("净利润增长速度:#{JSON.stringify(averagePercent)}")
	return averagePercent

#计算ROE得分
getRoeScore = (data)->
	retainedProfitsRowNum = getTypeRowNum(data, "六、净利润")
	netAssetRowNum = getTypeRowNum(data, "归属于母公司所有者权益合计")
	allNetAssets = data[netAssetRowNum].filter((a)-> a > 0)
	totalRoe = 0
	for netAsset, index in allNetAssets
		continue if index is 0
		roe = data[retainedProfitsRowNum][index] / ((Number(netAsset) + Number(allNetAssets[index - 1])) / 2) * 100
		totalRoe += roe
		console.log("roe:#{roe}")
	averageRoe = totalRoe / (allNetAssets.length - 1)
	console.log("averageRoe :#{averageRoe}")
	return averageRoe

analysisStatement = (fileName)->
	parseCsv(fileName, 
		(data)->
			console.log("-----------------#{fileName} info: -----------------")
			totalScore = 0
			totalAssetsIndex = getTypeRowNum(data, "资产总计")
			statisticsYears = getStatisticsYears(data, totalAssetsIndex)
			
			console.log("totalAssetsIndex #{totalAssetsIndex}, statisticsYears:#{statisticsYears}")
			for own calcItem, value of needCalcItem
				totalScore +=calcScore(data, calcItem, value, totalAssetsIndex)

			totalScore += getRetainedProfitsScore(data)
			totalScore += getRoeScore(data)
			totalScore = Math.ceil(totalScore)
			console.log("totalScore: #{totalScore}")
	)

fs.readdir('.', 
	(err, files)->
		for fileName in files
			if fileName.indexOf(".csv") isnt -1
				analysisStatement(fileName)
)


