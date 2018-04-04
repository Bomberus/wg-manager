'use strict'
const {Task, api} = require('actionhero')

module.exports = class SchedulerTask extends Task {
 constructor () {
   super()
   this.name = 'schedulerTask'
   this.description = 'I run the scheduler'
   this.frequency = 0
   this.queue = 'default'
   this.middleware = []
 }

 async run (data, worker) {
  try {
    const scheduleTable = await api.r.table('schedule').run()
    await scheduleTable.filter((data) => api.moment().isAfter(data.nextOcc))
    .forEach(async (data) => {
      data.lastOcc = api.moment().toDate()
      data.nextOcc = api.later.schedule(api.later.parse.cron(data.cron)).next()
      await api.r.table('schedule').get(data.id).update(data)
      await api.tasks.enqueue(data.task, {receiver: data.receiver, data: data.data }, 'default')
    }) 
  }
  catch(e) {
    api.log(e)
  }
 }
}