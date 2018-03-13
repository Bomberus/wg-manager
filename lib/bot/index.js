const Context = require('./context')
const Rules = require('./rule')

class Bot {
    constructor(api, ctx) {
        this.api = api
        this.context = new Context(api, ctx.message.from.id)
        this.rules = new Rules(api).rules
        this.ctx = ctx
    }

    listRules() {
        var msg = ''
        Object.keys(this.rules).forEach(sKey => {
            msg += `${sKey} - ${this.rules[sKey].description} \n`
        })
        return msg
    }
}

module.exports = Bot