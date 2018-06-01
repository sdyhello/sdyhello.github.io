fs      			= require 'fs'
BalanceSheet 		= require "./TableControl/BalanceSheet.coffee"
ProfitStatement 	= require "./TableControl/ProfitStatement.coffee"
CashFlowStatement 	= require "./TableControl/CashFlowStatement.coffee"

global.count = 0

analysisDir = "../zz500"

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
   for fileName in files
      if fileName.indexOf("zcfzb") isnt -1
         createClass(fileName)
)


# createClass("zcfzb_000858.csv")

console.log("ok")