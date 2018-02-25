"use strict"
const {Action, api} = require('actionhero')

class ValidatedAction extends Action {
  constructor () {
    super()
    this.inputs = {
      email: {
        required: true,
        validator: (param) => { api.validate_single(param, {email: true}) }
      },
      password: {
        required: true,
        validator: (param) => {
            api.validate_single({
                length: {
                    minimum: 6,
                    message: "must be at least 6 characters"
                }
            })
        }
      }
    }
  }
}

// the actions
exports.UserAdd = class UserAdd extends ValidatedAction {
  constructor () {
    super()
    this.name = 'userAdd'
    this.description = 'I add a user'
    this.inputs = Object.assign(this.inputs, { password_repeat: {
        required: true,
        validator: (param, connection, actionTemplate) => { 
            if (param !== connection.params.password) {
                throw Error("Passwords not identical")
            }
        } 
    } })
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
      this.name = 'userGet'
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
    this.name = 'userDelete'
    this.description = 'I delete a user'
    this.authenticate = true
  }

  async run (data) {
    await api.user.delete(data.connection)
  }
}