
class TableBase
	constructor: (@_stockType, @_stockCode)->
		@_data = []
		@_loadJson()

	getFilePath: ->

	getStockCode: -> @_stockCode

	getExistYears: -> @_existYears

	_loadJson: ->
		filePath = @getFilePath()
		cc.loader.loadJson(filePath, (error, data)=>
			unless data?
				console.log("load #{@_stockCode} failed !!")
			@_data = data
		)
	getBaseInfo: -> @_data["资料"][0] + "------" + @_data["资料"][2]

	getSharePrice: -> @_data["资料"][1]

	_getShowNumber : (number)->
		return "#{(number / 100000).toFixed(2)} 亿"

	getFormatNumberTable: (numberTable)->
		formatTable = []
		for number in numberTable
			formatTable.push @_getShowNumber(number)
		return formatTable

	_getYearValueIndex: ->
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
		@_existYears = length
		length

	_formatToInt: (valueTable)->
		intTable = []
		for value in valueTable
			intTable.push parseInt(value)
		return intTable

	getValue: (data, doNotToInt)->
		yearIndexTable = @_getYearValueIndex()
		valueTable = []
		for index in yearIndexTable
			valueTable.push data[index]

		valueTable = valueTable.slice(0, @_getValueLength(valueTable.length))
		if doNotToInt
			return valueTable
		return @_formatToInt(valueTable)
		
module.exports = TableBase