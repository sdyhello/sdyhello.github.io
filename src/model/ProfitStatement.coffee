TableBase 	= require "./TableBase.coffee"
utils 		= require '../tools/utils.coffee'

class ProfitStatement extends TableBase
	getFilePath: ->
		"res/#{@_stockType}_json/lrb_#{@_stockCode}.json"

	getIncomeValue: -> @getValue(@_data["营业收入(万元)"])

	getNetProfitAddRatio: ->
		netProfitTable = @getValue(@_data["净利润(万元)"])
		addTimes = netProfitTable[0] / netProfitTable[netProfitTable.length - 1]
		addRatio = utils.getCompoundRate(addTimes, global.year)
		addRatio = ((addRatio - 1) * 100).toFixed(2)
		addRatio

	getNetProfitTable : ->
		@getValue(@_data["净利润(万元)"])

	getNetProfitYoy: ->
		profitTable = @getValue(@_data["净利润(万元)"])
		addRatio = []
		for profit, index in profitTable
			break if index >= profitTable.length - 1
			addRatio.push ((profit - profitTable[index + 1]) / profitTable[index + 1] * 100).toFixed(2)
		addRatio

	getPE: ->
		earnPerShare = @getValue(@_data["基本每股收益"], true)[0]
		price = @getSharePrice()
		PE = (price / earnPerShare).toFixed(2)
		PE


module.exports = ProfitStatement