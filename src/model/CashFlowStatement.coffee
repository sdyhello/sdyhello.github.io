TableBase 	= require "./TableBase.coffee"

class CashFlowStatement extends TableBase

	getFilePath: ->
		"res/allA_json/xjllb_#{@_stockCode}.json"
		
	getWorkCashFlow: ->
		@getValue(@_data["经营活动产生的现金流量净额(万元)"])

module.exports = CashFlowStatement