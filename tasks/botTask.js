'use strict'
const {Task, api} = require('actionhero')

module.exports = class BotTask extends Task {
 constructor () {
   super()
   this.name = 'botTask'
   this.description = 'I run the bot'
   this.frequency = 0
   this.queue = 'high'
   this.middleware = []
 }

 async run (data, worker) {
  const Telegraf = require('telegraf')
  const { reply } = Telegraf
  
  const bot = new Telegraf(api.config.telegram.token)
  bot.on('message', (ctx) => ctx.reply('Pong'))
  try {
    await bot.handleUpdate(exampleMessage)
  }
  catch(e) {
    api.log(e);
  }
 }
}