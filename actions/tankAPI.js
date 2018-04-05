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