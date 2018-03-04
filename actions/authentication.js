"use strict"
const {Action, api} = require('actionhero')

class ValidatedAction extends Action {
  constructor () {
    super()
    this.inputs = {
      email: { 
        required: true,
        rules: 'email'
      },
      password: { 
        required: true,
        rules: 'min:6'
      }
    }
  }
}

// the actions
exports.UserAdd = class UserAdd extends ValidatedAction {
  constructor () {
    super()
    this.name = 'user:add'
    this.description = 'I add a user'
    this.inputs = Object.assign({
      password_repeat: { 
        required: true,
        rules: 'same:password' 
      }
    }, this.inputs)
  }

  async run (data) {
    try {
      await api.user.create(data.params.email, data.params.password)
      const token = await api.user.authenticate(data.params.email, data.params.password)
      data.connection.rawConnection.res.setHeader('Authorization', token)
    } catch(e) {
      throw e
    }
  }
}

// the actions
exports.UserGet = class UserAdd extends ValidatedAction {
    constructor () {
      super()
      this.name = 'user:get'
      this.description = 'I retrieve a user'
    }
  
    async run (data) {
        try {
            const token = await api.user.authenticate(data.params.email, data.params.password)
            data.connection.rawConnection.res.setHeader('Authorization', token)
        } catch (e){
            throw e
        }
    }
  }
  

exports.UserDelete = class UserDelete extends ValidatedAction {
  constructor () {
    super()
    this.name = 'user:delete'
    this.description = 'I delete a user'
    this.authenticate = true
  }

  async run (data) {
    await api.user.delete(data.connection)
  }
}