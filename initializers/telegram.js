const {Initializer, api} = require('actionhero')
const Telegram = require('telegraf/telegram')

module.exports = class TelegramInit extends Initializer {
  constructor () {
    super()
    this.name = 'telegram'
    this.loadPriority = 1000
    this.startPriority = 1000
    this.stopPriority = 1000
  }

  async initialize () { 
    api.telegram = new Telegram(api.config.telegram.token)
  }

  async start () {
    api.log('I started', 'info', this.name)
  }

  async stop () {
    api.log('I stopped', 'info', this.name)
  }
}