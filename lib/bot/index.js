const DB = require('./session')
const Rules = require('./rule')
const Context = require('telegraf/core/context')
const handlebars = require('handlebars')
const fs = require('fs')
const {Connection, ActionProcessor} = require('actionhero')

class Bot {
    constructor(api, data) {
        this.api = api
        this.rules = new Rules(api).rules
        this.ctx = new Context(data, api.telegram)
        this.ctx.db = new DB(api, this.ctx)
    }

    listRules() {
        var msg = ''
        Object.keys(this.rules).forEach(sKey => {
            msg += `/${sKey} - ${this.rules[sKey].description} \n`
        })
        return msg
    }

    static formatResponse(response) {
        if (response.error) {
            //
        } else {
            const template_name = this.getSession().action.replace(':', '_')
            const template = handlebars.compile(fs.readFileSync(`templates/${template_name}.handlebars`).toString())
            return template(response)
        }
    }

    async callAction() {
        const connection = new Connection({
            type: 'bot',
            remotePort: '0',
            remoteIP: '0',
            rawConnection: {}
        })

        connection.params = Object.assign({}, this.getSession().params) || {}
        connection.params.action = this.getSession().action
        const actionProcessor = new ActionProcessor(connection)
        let {response} = await actionProcessor.processAction()
        connection.destroy()
        
        return response
    }

    getTelegramClient(){
        return this.ctx.tg
    }

    initDB(){
        this.ctx.db.init()
        return this.getSession()
    }

    getSession(){
        return this.ctx.db.session
    }
    
    getRequiredParameter() {
        const actionTemplate = this.rules[this.getSession().action]
        let requiredParams = []
        this.api._.forEach(actionTemplate.inputs, (value, key) => {
            if (value.required) {
                requiredParams.push(Object.assign({name: key}, value))
            }
        } )

        // Extract what Param is missing
        const that = this
        return this.api._.find(requiredParams, function(oParam) { return !that.getSession().params[oParam.name] })
    }
    
    async loadSession(){
        return await this.ctx.db.get()
    }

    async saveSession(){ 
        await this.ctx.db.save()
        return this.getSession()
    }
}

module.exports = Bot