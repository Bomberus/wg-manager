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
  const Telegraf = require('telegraf')
  const Extra = require('telegraf/extra')
  const Markup = require('telegraf/markup')
  const bot = new Telegraf(api.config.telegram.token)
  const Bot = require('../lib/bot')
  const botClient = new Bot(api, data)

  bot.command('cancel', async (ctx) => {
    let context = await botClient.context.getContext()
    context.action = ''
    context.params = {}
    context.asking = ''
    await botClient.context.saveContext(context)
    ctx.reply('Operation canceled')
  })

  bot.command('start', (ctx) => {
    ctx.reply(botClient.listRules())
  })

  bot.on('message', async (ctx) => {
    // Handle Standard Intentions
    
    const context = await botClient.context.getContext()
    if (context.action) {
      // Extract Parameters
    } else {
      // Extract Intention from Message
      context.action = 'bahn:search'
    }
    
    // Get Action
    if (!botClient.rules[context.action]){
      ctx.reply('This is not the function you are searching for')
      throw Error(`Action ${context.action} not found`)
    }
    // Find required Params
    const actionTemplate = botClient.rules[context.action]
    let requiredParams = []
    api._.forEach(actionTemplate.inputs, (value, key) => {
      if (value.required) {
        requiredParams.push(Object.assign({name: key}, value))
      }
    } )

    // Extract what Param is missing
    const missingParam = api._.find(requiredParams, function(oParam) { return !context.params[oParam.name] })

    if (missingParam) {
      ctx.reply(`Please input: ${missingParam.description}`)
    } else {
      // Call internal action
      const connection = new Connection({
        type: 'task',
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
        const mustache = require('mustache')
        const fs = require('fs')
        const template = await fs.readFileSync(`templates/${context.action}.mustache`).toString()
        const responseMarkdown = mustache.render(template, response)
        ctx.reply(responseMarkdown, Extra.markdown().markup((m) =>
          m.inlineKeyboard([
            actionTemplate.outputExample.callbacks.map((aCallBack) => {
              if (aCallBack.length > 2){
                context = aCallBack[2](context)
              }
              return m.callbackButton(aCallBack[0], aCallBack[1]+JSON.stringify(context.params))
            }),
            Object.keys(actionTemplate.inputs).map((sKey) => {
              return m.callbackButton(sKey, sKey)
            })
          ])))

        
        /*ctx.reply(responseMarkdown, Extra.markdown()
          .markup((m) => {
            m.inlineKeyboard([
              m.callbackButton('Italic', 'italic')
            ])
        }))*/
        
      }
      // Free ActionProcessor
      connection.destroy()
    }
  })

  try {
    //bot.startPolling()
    //let updates = await bot.telegram.getUpdates()
    //await bot.handleUpdates(updates)
    await bot.handleUpdate(data) 
  }
  catch(e) {
    api.log(e)
  }
 }
}