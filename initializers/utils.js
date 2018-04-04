const {Initializer, api} = require('actionhero')

module.exports = class UtilsInit extends Initializer {
  constructor () {
    super()
    this.name = 'api_utils'
    this.loadPriority = 1000
    this.startPriority = 1000
    this.stopPriority = 1000
  }

  async initialize () { 
    api._ = require('lodash')
    api.moment = require('moment')
    api.later = require('later')
    api.transform = {
      toLower: (obj) => {
        return Object.keys(obj).reduce(function (newObj, key) {
          let val = obj[key]
          let newVal = (typeof val === 'object') ? api.transform.toLower(val) : val
          newObj[key.toLowerCase()] = newVal
          return newObj
        } , {})
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