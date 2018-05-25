TableBase 	= require "./TableBase.coffee"


class BalanceSheet extends TableBase
	getFilePath:->
		"res/#{@_stockType}_json/zcfzb_#{@_stockCode}.json"

	getCashValue: ->
		@getYearValue(@_data["货币资金(万元)"])

module.exports = BalanceSheet