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
  try {
    const Bot = require('../lib/bot')
    const botClient = new Bot(api, data)
    const TelegramAction = await botClient.handleUpdate()
    if (TelegramAction) {
      await api.telegram[TelegramAction.command].apply(api.telegram, TelegramAction.data)
    }    
  }
  catch(e) {
    api.log(e)
  }
 }
}