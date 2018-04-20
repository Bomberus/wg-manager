'use strict'
const {Action, api} = require('actionhero')

exports.TankGetStation = class TankAPIGetStation extends Action {
  constructor () {
    super()
    this.name = 'tank:search'
    this.description = 'I search for a tankStation',
    this.outputExample = {
      botInline: 'ts'
    }
    this.inputs = {
      data: {
        required: true,
        rules: 'min:10'
      }
    }
  }

  async run (data) {
    const geodata = await api.here.geocode(data.params.data)
    const gps = geodata[0].location.displayposition
    
    const stations = await api.tanken.getStations(gps.latitude, gps.longitude)
    
    data.response.type = 'location' 
    data.response.data = stations.filter(oStation => oStation.price != null).map(oStation => {
      return {
        id : oStation.id,
        longitude: oStation.lng,
        latitude: oStation.lat,
        street: oStation.street + ' ' +oStation.houseNumber,
        brand: oStation.brand,
        postCode: oStation.postCode,
        price: oStation.price,
        dist: oStation.dist
      } }).slice(0,30)
  }
}

exports.TankRegisterAlarm = class TankRegisterAlarm extends Action {
  constructor () {
    super()
    this.name = 'tank:add_alarm'
    this.description = 'I monitor a tank station',
    this.outputExample = {
      enableBot : true
    }
    this.inputs = {
      station: {
        required: true,
        description: 'TankStation'
      },
      desiredPrice: {
        required: true,
        description: 'Desired Price'
      },
      oilType: {
        required: true,
        description: 'Oil Type (e5, e10, diesel)'
      },
      botData: {
        required: true,
        description: 'Added by the bot'
      }
    }
  }

  async run (data) {
    await api.scheduler.add(data.params.botData.chat_id, 'telegram', 'tankTask', 'every 1 hours', data.params)
    //await api.tasks.enqueue('schedulerTask', {}, 'default')
  }
}