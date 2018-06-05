fs      			= require 'fs'
BalanceSheet 		= require "./TableControl/BalanceSheet.coffee"
ProfitStatement 	= require "./TableControl/ProfitStatement.coffee"
CashFlowStatement 	= require "./TableControl/CashFlowStatement.coffee"

analysisDir = "../allA"

BalanceSheetTable = []
ProfitStatementTable = []
CashFlowStatementTable = []

createClass = (stockCode)->
	stockCode = stockCode.substring(6, 12)
	BalanceSheetTable.push new BalanceSheet(analysisDir, stockCode)
	ProfitStatementTable.push new ProfitStatement(analysisDir, stockCode)
	CashFlowStatementTable.push new CashFlowStatement(analysisDir, stockCode)


fs.readdir(analysisDir,
	(err, files)->
		totalIndex = 0
		for fileName, index in files
#			break if totalIndex >= 1000
			if fileName.indexOf("zcfzb") isnt -1
				totalIndex++
				console.log("index:#{fileName}")
				createClass(fileName)
)


# createClass("zcfzb_000858.csv")

console.log("ok")