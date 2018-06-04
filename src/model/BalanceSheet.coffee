TableBase 	= require "./TableBase.coffee"
utils 		= require '../tools/utils.coffee'

class BalanceSheet extends TableBase
	getFilePath:->
		"res/#{@_stockType}_json/zcfzb_#{@_stockCode}.json"

	getCashValue: -> @getValue(@_data["货币资金(万元)"])

	getTotalAssets: -> @getValue(@_data["资产总计(万元)"])

	getNetAssets: -> @getValue(@_data["归属于母公司股东权益合计(万元)"])

	_getNoNeedCalcItems: -> ["资料", "报告日期"]

	getReceivableValue: -> @getValue(@_data["应收账款(万元)"])

	dumpPercentTable: ->
		totalAssets = @getTotalAssets()
		assetsPercentTable = []
		for key , value of @_data
			percentTable = [key + "\t\t\t\t\t"]
			continue if value[0] is 0
			continue if key in @_getNoNeedCalcItems()
			for celValue, index in @getValue(value)
				percent = celValue / totalAssets[index] * 100
				percentTable.push percent.toFixed(2)
				percentTable.push "\t\t\t\t"
			percentTable.push "\n"
			assetsPercentTable.push percentTable
		console.log(JSON.stringify(assetsPercentTable, null, "\t"))
		return assetsPercentTable

	getCurrentRatio: ->
		currentAssetsTable = @getValue(@_data["流动资产合计(万元)"])
		currentDebtsTable = @getValue(@_data["流动负债合计(万元)"])
		currentRatio = []
		for currentAssets, index in currentAssetsTable
			currentRatio.push (currentAssets / currentDebtsTable[index]).toFixed(2)
		currentRatio

	getQuickRatio: ->
		currentAssetsTable = @getValue(@_data["流动资产合计(万元)"])
		currentDebtsTable = @getValue(@_data["流动负债合计(万元)"])
		inventoryTable = @getValue(@_data["存货(万元)"])
		quickRatio = []
		for currentAssets, index in currentAssetsTable
			quickRatio.push ((currentAssets - inventoryTable[index]) / currentDebtsTable[index]).toFixed(2)
		quickRatio

	getAdvanceReceiptsPercent: ->
		advanceReceiptsTable = @getValue(@_data["预收账款(万元)"])
		totalAssetsTable = @getTotalAssets()
		percent = []
		for advanceReceipt, index in advanceReceiptsTable
			percent.push (advanceReceipt / totalAssetsTable[index]) * 100
		utils.getAverage(percent)

module.exports = BalanceSheet