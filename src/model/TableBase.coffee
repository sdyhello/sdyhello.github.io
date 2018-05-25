
class TableBase
	constructor: (@_stockType, @_stockCode)->
		@_data = []
		@_loadJson()

	getFilePath: ->

	_loadJson: ->
		filePath = @getFilePath()
		cc.loader.loadJson(filePath, (error, data)=>
			@_data = data
		)

	_getShowNumber : (number)->
		return "#{(number / 100000).toFixed(2)} 亿"

	getFormatNumberTable: (numberTable)->
		formatTable = []
		for number in numberTable
			formatTable.push @_getShowNumber(number)
		return formatTable

	getYearValueIndex: ->
		indexTable = []
		for timeStr, index in @_data["报告日期"]
			if timeStr.indexOf("12-31") isnt -1
				indexTable.push(index)
		return indexTable

	_getValueLength: (valueLength)->
		if valueLength < global.year
			length = valueLength
		else
			length = global.year
		length

	getYearValue: (data)->
		yearIndexTable = @getYearValueIndex()
		valueTable = []
		for index in yearIndexTable
			valueTable.push data[index]

		valueTable = valueTable.slice(0, @_getValueLength(valueTable.length))
		@getFormatNumberTable(valueTable)

module.exports = TableBase