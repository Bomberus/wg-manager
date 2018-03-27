'use strict'
const {Task, api, Connection, ActionProcessor} = require('actionhero')

module.exports = class BotTask extends Task {
 constructor () {
   super()
   this.name = 'botTask'
   this.description = 'I run the bot'
   this.frequency = 0
   this.queue = 'default'
   this.middleware = []
 }

 async run (data, worker) {
  /*const Telegraf = require('telegraf')
  const Extra = require('telegraf/extra')
  const bot = new Telegraf(api.config.telegram.token)*/

  /*bot.command('cancel', async (ctx) => {
    botClient.initContext()
    let newMessage = await ctx.reply('Operation canceled')
    botClient.setMessageID(newMessage.message_id)
    await botClient.saveContext(newMessage.message_id)
    //await telegram.editMessageText(botClient.context.chat_id, context.message_id, undefined, 'My changed Text')
  })

  bot.command('start', (ctx) => {
    ctx.reply(botClient.listRules())
  })

  bot.on('callback_query', async (ctx) => {
    let context = {}
        context.params = JSON.parse(ctx.data)
    
    const connection = new Connection({
      type: 'bot',
      remotePort: '0',
      remoteIP: '0',
      rawConnection: {}
    })
    connection.params = Object.assign({}, context.params) || {}
    const actionProcessor = new ActionProcessor(connection)
    let {response} = await actionProcessor.processAction()

    
  })

  bot.on('message', async (ctx) => {
    // Handle Standard Intentions
    let context = await botClient.loadContext()
    if (context.pendingInput != '') {
      let input = ctx.message.text.split(',')
      if (input.length === 1) {input = input[0]}
      context.params[context.pendingInput] = input
      context.pendingInput = ''
      await botClient.saveContext()
    } else {
      // Extract Intention from Message
      context.action = ctx.message.text
    }
    
    // Get Action
    if (!botClient.rules[context.action]){
      ctx.reply('This is not the function you are searching for')
      botClient.initContext()

      throw Error(`Action ${context.action} not found`)
    }

    const missingParam = botClient.getRequiredParameter()

    if (missingParam) {
      context.pendingInput = missingParam.name
      await botClient.saveContext()
      ctx.reply(`Please input: ${missingParam.description}`)
    } else {
      // Call internal action
      const connection = new Connection({
        type: 'bot',
        remotePort: '0',
        remoteIP: '0',
        rawConnection: {}
      })
      connection.params = Object.assign({}, context.params) || {}
      connection.params.action = context.action
      const actionProcessor = new ActionProcessor(connection)
      let {response} = await actionProcessor.processAction()

      if (response.error) {
        // Handle Error
      } else {
        // Handle Response + Formatting
        const handlebars = require('handlebars')
        const fs = require('fs')
        const template_name = context.action.replace(':', '_')
        const template = handlebars.compile(fs.readFileSync(`templates/${template_name}.handlebars`).toString())        
        const responseMarkdown = template(response)
        ctx.reply(responseMarkdown, Extra.markdown().markup((m) => {
          if (response.callbacks) {
            return m.inlineKeyboard([
              response.callbacks.map((aCallBack) => {
                let params = {}
                params.action = aCallBack[1]
                params = Object.assign(params, context.params)
                if (aCallBack.length > 2){
                  params = aCallBack[2](params)
                }
                return m.callbackButton(aCallBack[0], JSON.stringify(params))
              })
          ])}
        }))
      }
      // Free ActionProcessor
      connection.destroy()
    }
  })*/

  try {
    const Bot = require('../lib/bot')
    const botClient = new Bot(api, data)
    const session = await botClient.loadSession()
    
  }
  catch(e) {
    api.log(e)
  }
 }
}