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
      pagination: {
        rule: 'integer'
      },
      start: {
        required: false,
        description: 'Starting point'
      },
      dest: {
        required: false,
        description: 'Destination point'
      },
      timeOfArrival: {
        rule: 'date'
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
        'departure' : new Date(2018, 3, 13),
        'arrival' : new Date(2018, 3, 13),
        'traveltime' : 100 
      }
  }
}