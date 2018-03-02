const {Initializer, api} = require('actionhero')

module.exports = class BugSnagInit extends Initializer {
  constructor () {
    super()
    this.name = 'bugsnag'
    this.loadPriority = 1000
    this.startPriority = 1000
    this.stopPriority = 1000
  }

  async initialize () {     
    api.bugsnag = {
      client: require("bugsnag"),
    }
    
    api.bugsnag.ActionReporter = (err, name, object, severity) => {
      api.exceptionHandlers.report(err, "action", name, object, severity);
    }

    api.bugsnag.TaskReporter = (err, name, object, severity) => {
      api.exceptionHandlers.report(err, "task", name, object, severity);
    }


    api.log(api.env)
    api.bugsnag.client.register(api.config.bugsnag.apiKey, api.config.bugsnag.options)

    api.bugsnag.notifier = (err, type, name, objects, severity) => {
      let relevantObjects = {}
      if (type === 'action'){
        let relevantDetails = ['id', 'action', 'remoteIP', 'type', 'params', 'room']
        relevantObjects.connection = {}
        relevantDetails.forEach((key) => {
          relevantObjects.connection[key] = objects.connection[key]
        });
      }
      else{
        relevantObjects = objects
      }

      api.bugsnag.client.notify(err, {
        errorName: name,
        groupingHash: name,
        type: type, 
        objects: relevantObjects
      })
    };
  }

  async start () {
    if(api.config.bugsnag.enabled && api.env != 'test'){
      api.exceptionHandlers.reporters.push(api.bugsnag.notifier);
      api.log('I started', 'info', this.name)
    }
  }

  async stop () {
    if(api.env != 'test'){
      api.log('I stopped', 'info', this.name)
    }
  }
}