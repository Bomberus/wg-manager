const {
  Initializer,
  api
} = require('actionhero')
let Validator = require('validatorjs')

module.exports = class ValidatorMiddleware extends Initializer {
  constructor() {
    super()
    this.name = 'validate_middleware'
  }

  async initialize() {
    api.validate = (data) => {
      let rules = {}

      const addRule = (obj, path) => {
        if (!api._.isObject(obj)) {
          return
        }

        api._.forIn(obj, (value, sKey) => {

          if (api._.isObject(value)) {

            let nestedObj = value
            let sPath = ''
            if (path === '') {
              sPath = sKey
            } else {
              sPath = path + '.' + sKey
            }

            if (nestedObj.rules) {
              rules = api._.assign({
                [sKey]: nestedObj.rules
              }, rules)
            }

            addRule(nestedObj, sPath)
          }
        })
      }
      addRule(data.actionTemplate.inputs, '')

      if (rules) {
        let validation = new Validator(data.params, rules)

        if (validation.fails()) {
          throw new Error(JSON.stringify(validation.errors.all()))
        }

      }
    }
    const middleware = {
      name: this.name,
      global: true,
      preProcessor: async (data) => {
        api.validate(data)
      }
    }

    api.actions.addMiddleware(middleware)
  }

  async start() {
    api.log('I started', 'info', this.name)
  }

  async stop() {
    api.log('I stopped', 'info', this.name)
  }
}