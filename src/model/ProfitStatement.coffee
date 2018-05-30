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

	getNetProfitTable : -> @getValue(@_data["净利润(万元)"])

module.exports = ProfitStatement