const {Initializer, api} = require('actionhero')
const validate = require("validate.js");

module.exports = class ValidateInit extends Initializer {
  constructor () {
    super()
    this.name = 'validate'
    this.loadPriority = 1000
    this.startPriority = 1000
    this.stopPriority = 1000
  }

  async initialize () { 
    api.validate = validate
    api.validate_single = (data, constraints) => {
        const result_val = validate.single(data, constraints);
        if (result_val) {
            throw new Error(result_val[0])
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