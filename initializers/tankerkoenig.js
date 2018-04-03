const {Initializer, api} = require('actionhero')
const axios = require('axios')
const credentials = `&apikey=${process.env.TANKER_KOENIG_API}`



module.exports = class TankerKoenig extends Initializer {
  constructor () {
    super()
    this.name = 'tankerkoenig'
    this.loadPriority = 1000
    this.startPriority = 1000
    this.stopPriority = 1000
  }

  async initialize () { 
    api.tanken = {
      getDetails: async (stationId) => {
        let data = await axios.get(`https://creativecommons.tankerkoenig.de/json/detail.php?id=${stationId}` + credentials)
        return data.data.station
      },
      getPrices: async (stationIds) => {
        let data = await axios.get('https://creativecommons.tankerkoenig.de/json/prices.php?ids=' + stationIds.join(',') + credentials)
        return data.data.prices
      },
      getStations: async (lat, long, area = 10, type='e10') => {
        let data =  await axios.get(`https://creativecommons.tankerkoenig.de/json/list.php?lat=${lat}&lng=${long}&rad=${area}&sort=price&type=${type}`+ credentials)
        return data.data.stations
      }
    }
  }

  async start () {
    api.log('I started', 'info', this.name)
  }

  async stop () {
    api.log('I stopped', 'info', this.name)
  }
}