const {Initializer, api} = require('actionhero')

module.exports = class RethinkDBInit extends Initializer {
  constructor () {
    super()
    this.name = 'rethinkdb'
    this.loadPriority = 1000
    this.startPriority = 1000
    this.stopPriority = 1000
  }

  async initialize () { 
    api.r = require('rethinkdbdash')({
        port: api.config.rethinkdb.port,
        host: api.config.rethinkdb.host,
        ssl: false,
        db: api.config.rethinkdb.db,
        user: api.config.rethinkdb.user,
        password: api.config.rethinkdb.password
    })
  }

  async start () {
    api.log('I started', 'info', this.name)
  }

  async stop () {
    api.log('I stopped', 'info', this.name)
    api.r.getPoolMaster().drain();
  }
}