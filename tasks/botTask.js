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
  
  const exampleMessage = JSON.parse('{"update_id":851793512,"message":{"message_id":3050,"from":{"id":106928612,"is_bot":false,"first_name":"Pascal Maximilian","last_name":"Bremer","username":"Bomberus","language_code":"en-US"},"chat":{"id":106928612,"first_name":"Pascal Maximilian","last_name":"Bremer","username":"Bomberus","type":"private"},"date":1519398106,"text":"Hi"}}')

  const bot = new Telegraf("81531553:AAF564zO3nGk0PLw_QK2P7o-2IHojtYwwnw")
  bot.on('message', (ctx) => ctx.reply('Pong'))
  try {
    await bot.handleUpdate(exampleMessage)
  }
  catch(e) {
    api.log(e);
  }
 }
}