'use strict'
const {Task, api} = require('actionhero')

module.exports = class TankTask extends Task {
 constructor () {
   super()
   this.name = 'tankTask'
   this.description = 'I run the tank task'
   this.frequency = 0
   this.queue = 'default'
   this.middleware = []
 }

 async run (data, worker) {
  try {
    const tankUsers = await api.r.table('tank_users').run()
    await tankUsers.forEach(async (data) => {
      
    }) 
  }
  catch(e) {
    api.log(e)
  }
 }
}