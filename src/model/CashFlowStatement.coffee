TableBase 	= require "./TableBase.coffee"
TitleName 	= require "../title.coffee"

class CashFlowStatement extends TableBase
	getFirstColTitle: ->
		TitleName.getCashFlowTitle()

	getFilePath: ->
		"res/allA/xjllb_#{@_stockCode}.csv"
		
	getWorkCashFlow: ->
		@getValue(@_data["经营活动产生的现金流量净额(万元)"])

module.exports = CashFlowStatement