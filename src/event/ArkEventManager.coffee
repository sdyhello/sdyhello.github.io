EventManager =
    send: (eventName, data)->
        event = new cc.EventCustom(eventName)
        if (data != null)
            event.setUserData(data)
        cc.eventManager.dispatchEvent(event)
    listen: (eventName, listenFunc, nodeOrPriority)->
        nodeOrPriority ?= 1
        ccListener = cc.EventListener.create(
            event: cc.EventListener.CUSTOM,
            eventName: eventName,
            callback: (event) ->
                return listenFunc(event.getUserData(), event);
        )
        cc.eventManager.addListener(ccListener, nodeOrPriority);
module.exports = EventManager