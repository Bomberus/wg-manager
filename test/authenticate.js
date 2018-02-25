'use strict'

const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
chai.use(dirtyChai)

const ActionHero = require('actionhero')
const actionhero = new ActionHero.Process()
let api
let connection
let jwt_header 

describe('actionhero Tests', () => {
  beforeEach(async () => {
      jwt_header = {}
  })
  
  before(async () => { 
    api = await actionhero.start()
    await api.r.table("users").delete().run()
    connection = new api.specHelper.Connection()
    connection.rawConnection = 
    {
      res:{
        setHeader: ((headerName, token) => {
          jwt_header[headerName] = token
        })
      }
    }
  })
  after(async () => { await actionhero.stop() })

  it('should have booted into the test env', () => {
    expect(process.env.NODE_ENV).to.equal('test')
    expect(api.env).to.equal('test')
    expect(api.id).to.be.ok()
  })

  it('Validate field missing', async () => {
    connection.params = {
      email: "test@test.de"
    }
    let data = await api.specHelper.runAction('userAdd', connection ) 
    expect(data.error).to.equal('Error: password is a required parameter for this action')
  })

  it('Validate wrong repeat password', async () => {
    connection.params = {
      email: "test@test.de",
      password: "12345678",
      password_repeat: "1234567"
    }
    let data = await api.specHelper.runAction('userAdd', connection ) 
    expect(data.error).to.eq("Error: Passwords not identical")
  })

  it('Create a new User', async () => {
    connection.params = {
        email: "test@test.de",
        password: "12345678",
        password_repeat: "12345678"
    }
    let data = await api.specHelper.runAction('userAdd', connection ) 
    const users = await api.r.table("users").run()
    expect(users.length).to.eq(1)
    expect(jwt_header).to.be.an('object').that.has.all.keys('Authorization');
  })

  it('User already created', async () => {
    connection.params = {
        email: "test@test.de",
        password: "12345678",
        password_repeat: "12345678"
    }
    let data = await api.specHelper.runAction('userAdd', connection )
    const users = await api.r.table("users").run()
    expect(users.length).to.eq(1)
    expect(data.error).to.equal("Error: User already registered")
  })

  it('Authenticate wrong password', async () => {
    connection.params = {
      email: "test@test.de",
      password: "1234567"
    }
    let data = await api.specHelper.runAction('userGet', connection ) 
    expect(data.error).to.eq('Error: Wrong Password')
  })

  it('Authenticate', async () => {
    connection.params = {
      email: "test@test.de",
      password: "12345678"
    }
    let data = await api.specHelper.runAction('userGet', connection ) 
    expect(jwt_header).to.be.an('object').that.has.all.keys('Authorization');
  })

  it('Delete wrong jwt', async () => {
    connection.params = {
      httpHeaders: {
        Authorization: "jwt"
      }
    }
    let data = await api.specHelper.runAction('userDelete', connection ) 
    expect(data.error).to.eq("Error: Invalid Authorization Header")
  })

  it('Delete user', async () => {
    connection.params = {
      email: "test@test.de",
      password: "12345678",  
      httpHeaders: jwt_header 
    }
    let data = await api.specHelper.runAction('userGet', connection ) 
        data = await api.specHelper.runAction('userDelete', connection ) 
    const users = await api.r.table("users").run()
    expect(users.length).to.eq(0)
    
  })

})
