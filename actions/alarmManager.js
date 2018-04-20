'use strict'
const {Action, api} = require('actionhero')

exports.AlarmRemove = class AlarmRemove extends Action {
  constructor () {
    super()
    this.name = 'alarm:remove'
    this.description = 'I remove an alarm'

    this.inputs = {
      id: {
        required: true,
        description: 'QueryId'
      }
    }
  }

  async run (data) {
    await api.scheduler.remove(data.params.id)
  }
}