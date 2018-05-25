TableBase 	= require "./TableBase.coffee"
TitleName 	= require "../../title.coffee"

class CashFlowStatement extends TableBase
	getFirstColTitle: ->
		TitleName.getCashFlowTitle()

	getFilePath: ->
		"#{@_dir}/xjllb_#{@_stockCode}.csv"

	getPrefix: -> "xjllb_"

module.exports = CashFlowStatement