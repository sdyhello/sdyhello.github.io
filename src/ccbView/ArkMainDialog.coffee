eventManager = require '../event/ArkEventManager.coffee'
eventNames = require '../event/ArkEventNames.coffee'

TAG_ASSETS = "totalAssets"
TAG_RECEIVABLE = "receivables"
TAG_DEPOSIT = "depositReceived"
TAG_RETAINED_PROFITS = "retainedProfits"
TAG_SHORT_LOAN = "shortLoan"
TAG_LONG_LOAN = "longLoan"

class ArkMainDialog
    onDidLoadFromCCB: ->
        @_editBoxTable = {}
        @_datTable = []
        @init()

    init: ->
        for index in [1..6]
            continue unless @["ccb_textField_#{index}"]?
            console.log("ccb_textField_#{index}")
            editBox = @_createEditBox(@["ccb_textField_#{index}"])
            @rootNode.addChild(editBox)
            @_editBoxTable[@_getEditBoxName(index)] = editBox

        @_initTestData()

        return

    _initTestData: ->
        testData = ["132675000000", "1432734000", "407706000000", "27890483300", "16108858700", "96029044700"]
        index = 0
        for own key, value of @_editBoxTable
            console.log(value, testData[index])
            value.setString(testData[index])
            index++

    _getEditBoxName: (index)->
        tag = ""
        switch index
            when 1
                tag = TAG_ASSETS
            when 2
                tag = TAG_RECEIVABLE
            when 3
                tag = TAG_DEPOSIT
            when 4
                tag = TAG_RETAINED_PROFITS
            when 5
                tag = TAG_SHORT_LOAN
            when 6
                tag = TAG_LONG_LOAN
        return tag

    _createEditBox: (node)->
        editBox = new cc.EditBox(cc.size(200, 50))
        editBox.setPosition(node.getPosition())
        editBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE)
        editBox.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE)
        editBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_INITIAL_CAPS_SENTENCE)
        editBox.setMaxLength(13)
        editBox.setFont("Arial", 26)
        editBox.setFontColor(cc.color(100, 100, 255, 255))
        return editBox

    showResult: (result)->
        @ccb_result.setString(result)
        contentSize = @ccb_result.getContentSize()
        @ccb_result_bg.setContentSize(cc.size(contentSize.width + 50, contentSize.height + 50))

    onCalc: ->
        totalAssets = Number(@_editBoxTable[TAG_ASSETS].getString())
        totalAssetsTable = [TAG_ASSETS, totalAssets]
        receivable = Number(@_editBoxTable[TAG_RECEIVABLE].getString())
        receivableTable = [TAG_RECEIVABLE, receivable]
        depositReceive = Number(@_editBoxTable[TAG_DEPOSIT].getString())
        depositReceiveTable = [TAG_DEPOSIT, depositReceive]
        retainedProfits = Number(@_editBoxTable[TAG_RETAINED_PROFITS].getString())
        retainedProfitsTable = [TAG_RETAINED_PROFITS, retainedProfits]
        shortLoan = Number(@_editBoxTable[TAG_SHORT_LOAN].getString())
        shortLoanTable = [TAG_SHORT_LOAN, shortLoan]
        longLoan = Number(@_editBoxTable[TAG_LONG_LOAN].getString())
        longLoanTable = [TAG_LONG_LOAN, longLoan]

        dataTable = [totalAssetsTable, receivableTable, depositReceiveTable, retainedProfitsTable, shortLoanTable, longLoanTable]

        @showResult("")
        eventManager.send eventNames.GAME_GET_RESULT,
            data: dataTable
            callback: (str)=>
                @showResult(str)

    cc.BuilderReader.registerController(
        "ArkMainDialog"
        new ArkMainDialog()
    )

module.exports = cc.BuilderReader.load("res/main.ccbi")