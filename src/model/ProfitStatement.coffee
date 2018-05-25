TableBase 	= require "./TableBase.coffee"

class ProfitStatement extends TableBase
	getFilePath: ->
		"res/#{@_stockType}_json/lrb_#{@_stockCode}.json"

module.exports = ProfitStatement