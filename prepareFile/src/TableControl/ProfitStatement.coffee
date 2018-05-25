TableBase 	= require "./TableBase.coffee"
TitleName 	= require "../../title.coffee"

class ProfitStatement extends TableBase
	getFirstColTitle: ->
		TitleName.getProfitTitle()

	getFilePath: ->
		"#{@_dir}/lrb_#{@_stockCode}.csv"

	getPrefix: -> "lrb_"

module.exports = ProfitStatement