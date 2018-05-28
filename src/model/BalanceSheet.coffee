TableBase 	= require "./TableBase.coffee"


class BalanceSheet extends TableBase
	getFilePath:->
		"res/#{@_stockType}_json/zcfzb_#{@_stockCode}.json"

	getCashValue: -> @getValue(@_data["货币资金(万元)"])

	getTotalAssets: -> @getValue(@_data["资产总计(万元)"])

	_getNoNeedCalcItems: -> ["资料", "报告日期"]

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
module.exports = BalanceSheet