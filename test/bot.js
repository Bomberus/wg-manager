'use strict'

const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
chai.use(dirtyChai)
const Bot = require("../lib/bot")

const ActionHero = require('actionhero')
const actionhero = new ActionHero.Process()
let api
let connection



describe('Telegram Integration Test', () => {
  
  before(async () => { 
    api = await actionhero.start()
    await api.r.table("telegram").delete().run()
    connection = new api.specHelper.Connection()
  })
  after(async () => { await actionhero.stop() })

  it('should have booted into the test env', () => {
    expect(process.env.NODE_ENV).to.equal('test')
    expect(api.env).to.equal('test')
    expect(api.id).to.be.ok()
  })

  /*it('Bot should contain documentation', async () => {
    const test_ctx = {message :  { from : {  id: 666  }, text : 'Hello'  } }
    const bot = new Bot(api, test_ctx)
    let context = await bot.context.getContext()
    context.data = 'Hello World'
    await bot.context.saveContext(context)
  })

  it('Bot lists the rules', async () => {
    const test_ctx = {message :  { from : {  id: 666  }, text : 'Hello'  } }
    const bot = new Bot(api, test_ctx)
  })*/

})
