const {Initializer, api} = require('actionhero')
const axios = require('axios')
const credentials = `?app_id=${process.env.HERE_APP_ID}&app_code=${process.env.HERE_APP_CODE}`

module.exports = class HereInit extends Initializer {
  constructor () {
    super()
    this.name = 'here'
    this.loadPriority = 1000
    this.startPriority = 1000
    this.stopPriority = 1000
  }

  async initialize () { 
    api.here = {
      geocode : async (searchtext) => {
        try {
          let matches = await axios.get('https://geocoder.cit.api.here.com/6.2/geocode.json' + credentials + `&searchtext=${searchtext}`)
              matches = api.transform.toLower(matches)
          return matches.data.response.view[0].result
        } catch(e) {
          api.log(e)
        }
      },
      calculateRoute: async (start, destination, config = {}) => {
        config.departure = config.departure || 'now'
        config.transportMode = config.transportMode || 'car'
        config.speedMode = config.speedMode || 'fastest'
        config.traffic = config.traffic || 'enabled'

        let route = await axios.get('https://route.cit.api.here.com/routing/7.2/calculateroute.json' + 
                                      credentials + 
                                      `&waypoint0=geo!${start}` +
                                      `&waypoint1=geo!${destination}` + 
                                      `&departure=${config.departure}` +
                                      `&mode=${config.speedMode};${config.transportMode};traffic:${config.traffic}` +
                                      '&maneuverAttributes=roadName,travelTime,notes,trafficTime,baseTime&language=de-de' )
            route = route.data.response.route
        return {
          raw: route, 
          trafficNote: route[0].leg[0].maneuver
            .filter((oNode) => {
              return oNode.note.some(({type}) => type === 'traffic')
            })
            .map((oNode) => {
            
            var oTrafficNode = oNode.note.find(({type}) => type === 'traffic')

            return { 
              roadName: oNode.roadName,
              time: oNode.trafficTime - oNode.baseTime,
              text: oTrafficNode.text,
              level: oTrafficNode.additionalData.find(({key}) => key === 'severity').value
            }
          })
        }
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