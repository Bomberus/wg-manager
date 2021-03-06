'use strict'
const {Action, api} = require('actionhero')

class BotAction extends Action {
  constructor () {
    super()
    this.name = 'start:bot'
    this.description = 'Start the bot'
    this.inputs = {
      update_id : {},
      message: {},
      inline_query: {}
    }
  }
  async run(data) {
    await api.tasks.enqueue('botTask', data.params, 'default')
  }
}

exports.BotAction = BotAction