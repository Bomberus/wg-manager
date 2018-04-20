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

 /* data
    {
      id - id of Station
      desiredPrice - price that is desired
      oilType - type of oil to monitor (e5, e10, diesel)
    }
 */

 async run (data, worker) {
  try {
    const taskData = data.data
    const taskReceiver = data.receiver
    const taskType = data.type


    const station = await api.tanken.getDetails(taskData.station)
    if (station[taskData.oilType] <= taskData.desiredPrice )

      switch (taskType) {
        case 'telegram':
          await api.telegram['sendMessage']
          .apply(api.telegram, [
            taskReceiver,
            `*** Tankstellen Alarm *** \n In Tankstelle ${station.name}: ${station.street} ${station.postCode} beträgt der Preis für ${taskData.oilType}: ${station[taskData.oilType]} 
            \nYou can delete the alarm with: /alarm:remove ${data.id}` ])
          
          await api.telegram['sendLocation']
            .apply(api.telegram, [
              taskReceiver,
              station.lat,
              station.lng ])
          break
        default:
          //Cannot handle Update Type
          break
      }
  }
  catch(e) {
    api.log(e)
  }
 }
}