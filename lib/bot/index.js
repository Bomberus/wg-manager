const DB = require('./session')
const Rules = require('./rule')
const Context = require('telegraf/core/context')
const handlebars = require('handlebars')
const fs = require('fs')
const {Connection, ActionProcessor} = require('actionhero')

class Bot {
    constructor(api, data) {
        this.api = api
        let rules = new Rules(api)
        this.rules = rules.rules
        this.inline_rules = rules.inline_rules
        this.ctx = new Context(data, api.telegram)
        this.ctx.db = new DB(api, this.ctx)
    }

    getInputData() {
        let inputData = {}

        this.ctx.updateSubTypes.forEach((sUpdateSubType) => {
            switch (sUpdateSubType) {
                case 'text':
                    let text = this.ctx.message.text
                    //Extract command
                    let command = this.ctx.message.entities.filter(oEntity => oEntity.type === 'bot_command')[0]
                    if (command){
                        inputData.command = text.slice(command.offset, command.length)
                        text = text.replace(inputData.command, '')
                    }
                    inputData.text = text
                    break
                case 'location':
                    inputData.params = this.ctx.message.location
                break
            }
        })
        
        if (inputData === {} ) {
            this.api.log('No data received, stopping processing')
            return
        }

        return inputData
    }

    async handleUpdate() {
        let inputData = {}
        
        switch (this.ctx.updateType){
            case 'message':
                this.ctx.db.user_id = this.ctx.message.from.id 
                this.ctx.db.chat_id = this.ctx.message.chat.id
                await this.loadSession()
                inputData = this.getInputData()
                if (inputData){
                    return await this.handleMessage(inputData)
                }
                break
            case 'callback_query':
                this.ctx.db.user_id = this.ctx.callbackQuery.from.id 
                this.ctx.db.chat_id = this.ctx.callbackQuery.chat.id
                await this.loadSession()
                inputData = this.getInputData()
                if (inputData)
                    return await this.handleCallback(inputData)
                break
            case 'inline_query':
                this.ctx.db.user_id = this.ctx.inlineQuery.from.id
                return await this.handleInline({text: this.ctx.inlineQuery.query})
            default:
                this.api.log(`updateType: ${this.ctx.updateType} not implemented`)
                return
        }
    }
    //Used for executing rules
    async handleMessage(data) {
        let session = this.getSession()
        if (data.command === '/cancel') {
            this.initDB()
            this.saveSession()
            return {command: 'sendMessage', data: [
                session.chat_id,
                'reset' ]}
        }
        
        // Get action (maybe use machine learning?)        
        if (session.action === ''){
            session.action = data.command.slice(1)
        } 
        let missingParam = this.getRequiredParameter()
        if (typeof missingParam === 'undefined' 
            && data.command != ''
            && data.command != session.action){
                session = this.initDB()
                session.action = data.command.slice(1)
        }
        
        let action = this.rules[session.action]

        if (typeof action === 'undefined') {
            return {command: 'sendMessage', data: [
                session.chat_id,
                'This is not the function you are looking for' ]}
        }
        
        if (data.text) {
            session.params[missingParam.name] = data.text
            try {
                this.api.validate({ actionTemplate: action, params: session.params})
            }
            catch(e) {
                let error = ''
                this.api._.forEach(JSON.parse(e.message), (oError) => {
                    error += oError.message + '\n'
                })
                return {command: 'sendMessage', data: [
                    session.chat_id,
                    error ]}
            }
        }    
        this.saveSession()   

        missingParam = this.getRequiredParameter()
        if (missingParam) {
            return {command: 'sendMessage', data: [
                session.chat_id,
                `Please input ${missingParam.description} ` ]}
        } else {
            let response = await this.callAction(session.action, session.params)
            let result = this.formatResponse(session.action, response)
            return {command: 'sendMessage', data: [
                session.chat_id,
                result,
                'Markdown'
            ]}
        }

    }
    async handleCallback(data) {
        
    }

    //Used for executing callback rules (only one parameter)
    async handleInline(data) {
        let command = data.text.slice(0, data.text.indexOf(' '))
        let input = data.text.replace(command, '').trim()

        //Get Inline Action
        let action = this.inline_rules[command]

        if (typeof action === 'undefined'){
            this.api.log(`Inline-Action: ${command} not found`)
            return
        }
        
        try{
            this.api.validate({ actionTemplate: action, params: { data: input } })
            let response = await this.callAction(action.name, {data: input})
            let results = response.data.map((data) => {
                let result =  { }
                Object.assign(result, data)
                result.type = response.type
                result.title = this.formatResponse(action.name, data)
                return result
            })
            return {command: 'answerInlineQuery', data: [this.ctx.inlineQuery.id, results]}

        } catch(e){
            this.api.log(e.message)
        }
        

    }

    listRules() {
        var msg = ''
        Object.keys(this.rules).forEach(sKey => {
            msg += `/${sKey} - ${this.rules[sKey].description} \n`
        })
        return msg
    }

    formatResponse(action, response) {
        if (response.error) {
            //
        } else {
            const template_name = action.replace(':', '_')
            const template = handlebars.compile(fs.readFileSync(`templates/${template_name}.handlebars`).toString())
            return template(response)
        }
    }

    async callAction(action, params) {
        const connection = new Connection({
            type: 'bot',
            remotePort: '0',
            remoteIP: '0',
            rawConnection: {}
        })

        connection.params = Object.assign({}, params) || {}
        connection.params.action = action
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