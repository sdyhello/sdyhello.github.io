utils =
    getCompoundRate: (addRate, time)->
        return Math.exp(1 / time * Math.log(addRate))

    getAverage: (table)->
        total = 0
        for value in table
            total += parseInt(value)
        ave = (total / table.length).toFixed(2)
        ave
module.exports = utils