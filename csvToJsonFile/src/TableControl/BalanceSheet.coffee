TableBase 	= require "./TableBase.coffee"
TitleName 	= require "../../title.coffee"


class BalanceSheet extends TableBase
	getFirstColTitle: ->
		TitleName.getBalanceTitle()

	getFilePath:->
		"#{@_dir}/zcfzb_#{@_stockCode}.csv"

	getPrefix: -> "zcfzb_"

module.exports = BalanceSheet