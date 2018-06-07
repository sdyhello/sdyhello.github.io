TableBase 	= require "./TableBase.coffee"
utils 		= require '../tools/utils.coffee'
TitleName 	= require "../title.coffee"

class ProfitStatement extends TableBase
	getFilePath: ->
		"res/allA/lrb_#{@_stockCode}.csv"

	getFirstColTitle: ->
		TitleName.getProfitTitle()

	getIncomeValue: -> @getValue(@_data["营业收入(万元)"])

	getNetProfitAddRatio: ->
		netProfitTable = @getNetProfitTable()
		addTimes = netProfitTable[0] / netProfitTable[netProfitTable.length - 1]
		addRatio = utils.getCompoundRate(addTimes, global.year)
		addRatio = ((addRatio - 1) * 100).toFixed(2) + "%"
		addRatio

	getNetProfitTable : ->
		@getValue(@_data["归属于母公司所有者的净利润(万元)"])

	getNetProfitYoy: ->
		profitTable = @getNetProfitTable()
		addRatio = []
		for profit, index in profitTable
			break if index >= profitTable.length - 1
			addRatio.push ((profit - profitTable[index + 1]) / profitTable[index + 1] * 100).toFixed(2) + "%"
		addRatio

	getPE: ->
		earnPerShare = @getValue(@_data["基本每股收益"], true)[0]
		price = @getSharePrice()
		PE = (price / earnPerShare).toFixed(2)
		PE


module.exports = ProfitStatement