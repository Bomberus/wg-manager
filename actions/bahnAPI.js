'use strict'
const {Action, api} = require('actionhero')

exports.BahnGetConnection = class BahnAPIGetConnection extends Action {
  constructor () {
    super()
    this.name = 'bahn:search'
    this.description = 'I search for a connection',
    this.outputExample = {
      template : 'SearchBahnAPI',
      enableBot : true
    }
    this.inputs = {
      start: {
        required: true,
        description: 'Starting point'
      },
      dest: {
        required: true,
        description: 'Destination point'
      },
      timeOfDeparture: {
        rule: 'date'
      }
    }
  }

  async run (data) {
    data.response.connections = 
      {
        'from' : 'Karlsruhe',
        'to' : 'Walldorf',
        'departure' : api.moment().format('DD.MM HH:mm'),
        'arrival' : api.moment().format('DD.MM HH:mm'),
        'traveltime' : 100 
      }
  }
}