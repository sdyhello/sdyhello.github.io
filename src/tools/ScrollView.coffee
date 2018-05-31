ScrollView =
    createScrollView: (targetNode)->
        size = targetNode.getContentSize()
        container = new cc.Node()
        scrollView = new cc.ScrollView(size, container)
        scrollView.setPosition(targetNode.getPosition())
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL)
        scrollView.setTouchEnabled(true)
        scrollView

    initFromContainer: (scrollView, inner)->
        inner.setPosition({x: 0, y: 0})
        inner.setAnchorPoint({x: 0, y: 0})
        inner.removeFromParent()
        container = scrollView.getContainer()
        container.setContentSize(inner.getContentSize())
        container.addChild(inner)

    scrollJumpToTop: (scrollView)->
        container = scrollView.getContainer()
        offset = scrollView.getViewSize().height - container.getContentSize().height
        if offset < 0
            scrollView.setContentOffset({x: 0, y: offset})
        else
            scrollView.setContentOffset({x: 0, y: 0})

module.exports = ScrollView