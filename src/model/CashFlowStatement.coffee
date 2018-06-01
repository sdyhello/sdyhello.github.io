TableBase 	= require "./TableBase.coffee"

class CashFlowStatement extends TableBase

	getFilePath: ->
		"res/#{@_stockType}_json/xjllb_#{@_stockCode}.json"
		
	

module.exports = CashFlowStatement