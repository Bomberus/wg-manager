const Context = require("./context")
const Rules = require("./rules")

export default class Bot {
    constructor(api, ctx) {
        this.api = api
        this.context = new Context(api, )
        this.rules = new Rules(api)
        this.ctx = ctx
    }
}