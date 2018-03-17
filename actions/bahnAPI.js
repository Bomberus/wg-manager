'use strict'
const {Action, api} = require('actionhero')

exports.BahnGetConnection = class BahnAPIGetConnection extends Action {
  constructor () {
    super()
    this.name = 'bahn:search'
    this.description = 'I search for a connection',
    this.outputExample = {
      template : 'SearchBahnAPI',
      enableBot : true,
      callbacks : [
        ["Back", "bahn:search"],
        ["Subscribe", "bahn:subscribe"],
        ["Next", "bahn:search"]
      ]
    }
    this.inputs = {
      pagination: {
        hidden: true,
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