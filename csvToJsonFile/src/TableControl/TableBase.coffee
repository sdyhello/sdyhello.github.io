fs      	= require 'fs'
parse   	= require('csv').parse
StockInfoTable 	=  require "../../StockInfoTable.coffee"

class TableBase
	constructor: (@_dir, @_stockCode)->
		@_data = []
		@_dataObj = {}
		@_parseCsv(@getFilePath())
		@_setStockInfo()

	getFilePath: ->
	getFirstColTitle: ->


	_parseCsv: (path)->
		data = fs.readFileSync path, { encoding: 'utf-8' }
		parse data, {delimiter: ','}, (error, table)=>
			throw new Error(error) if error?
			@_data = table
			@_data.unshift(@_stockInfo)
			@_initTable(@getFirstColTitle())
			@_saveToJson()

	_replaceNullCell: ->
		for item, index in @_data
			for value, count in item
				if value is "--"
					item[count] = 0
		return

	_replaceFirstColTitle : (title)->
		for item, index in @_data
			item[0] = title[index]
		return

	_initTable: (title)->
		@_replaceFirstColTitle(title)
		@_replaceNullCell()
		@_changeToObj()

	_changeToObj: ->
		for item in @_data
			@_dataObj[item[0]] = item.slice(1, item.length)

	printData: ->
		console.log(JSON.stringify @_data)

	_saveToJson : ->
		console.log("#{@_dir}_json/#{@getPrefix() + @_stockCode}.json")
		fs.writeFileSync "#{@_dir}_json/#{@getPrefix() + @_stockCode}.json", JSON.stringify(@_dataObj)

	isDataOk: -> @_data?

	_setStockInfo: ->
		if @_dir.indexOf("hs300") isnt -1
			infoTable = StockInfoTable.getHs300()
			for info in infoTable
				if info[0].indexOf("" + @_stockCode) isnt -1
					@_stockInfo = info
					break
		if @_dir.indexOf("zz1000") isnt -1
			infoTable = StockInfoTable.getZz1000()
			for info in infoTable
				if info[0].indexOf("" + @_stockCode) isnt -1
					@_stockInfo = info
					break
		return

module.exports = TableBase