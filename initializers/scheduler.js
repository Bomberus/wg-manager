const {Initializer, api} = require('actionhero')

module.exports = class SchedulerDBInit extends Initializer {
  constructor () {
    super()
    this.name = 'scheduler'
    this.loadPriority = 1000
    this.startPriority = 1000
    this.stopPriority = 1000
  }
/*
    Minutes	Yes	0–59	* , -	
    Hours	Yes	0–23	* , -	
    Day of month	Yes	1–31	* , - ? L W	? L W only in some implementations
    Month	Yes	1–12 or JAN–DEC	* , -	
    Day of week	Yes	0–6 or SUN–SAT	* , - ? L #	? L W only in some implementations
    Year	No	1970–2099	* , -	This field is not supported in standard/default implementations
*/


  async initialize () { 
    api.scheduler = {
      getTable : () => {
        return api.r.table('schedule')
      },
      remove: async(id) => {
        await api.scheduler.getTable().get(id).delete().run()
      },
      add: async(receiver, type, task, cron, data = {} ) => {
        try {
          const isCron = /((\\d+|\\*|\\?)\\s*){6}/g.test(cron)
          
          await api.scheduler.getTable().insert({
            nextOcc : isCron ? api.later.schedule(api.later.parse.cron(cron)).next() : api.later.schedule(api.later.parse.text(cron)).next(),
            data: data,
            lastOcc: null,
            receiver: receiver,
            cron: cron,
            type: type,
            task: task
          }).run()
        } catch(err) {return err}
      },
      get: async(receiver, type, task) => {
          return await api.scheduler.getTable().filter((schedule) => {
            return schedule('receiver').eq(receiver).and(
                   schedule('task').eq(task).and(
                   schedule('type').eq(type)
                   )
            )
          }).run()
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