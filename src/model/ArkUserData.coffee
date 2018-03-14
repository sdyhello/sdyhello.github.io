class UserData
    constructor: ->
        @_score = 0
        @_count = 0

    setScore: (@_score)->

    getScore: -> @_score

    setCount: (@_count)->

    getCount: -> @_count

module.exports = UserData