
LayerManager =
    init: ->
        @layerStack = []
        @scene = new cc.Scene()
        cc.director.runScene(@scene)

    clearLayer: ->
        @scene.removeAllChildren()
        @layerStack.length = 0

    addLayerToScene : (ccbLayer, zOrder = 0)->
        layout = new ccui.Layout()
        layout.setContentSize(cc.size(1136, 640))
        layout.setTouchEnabled(true)

        node =new cc.Node()
        node.addChild(layout)
        node.addChild(ccbLayer)

        @scene.addChild(node, zOrder)
        @layerStack.push(node)

    removeTopLayer: ->
        topLayer = @layerStack.pop()
        @scene.removeChild(topLayer, true)

class Loader
    constructor: (@ccbFile, @controllerName) ->
    showDialog:  ->
        cc.BuilderReader.load(@ccbFile)

LayerManager.defineDialog = (ccbFile, controllerName, controllerClass) ->
    cc.BuilderReader.registerController(
        controllerName
        new controllerClass()
    )

    new Loader(ccbFile, controllerName)

module.exports = LayerManager