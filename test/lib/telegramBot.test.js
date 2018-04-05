let connection
let api
let actionhero
let Bot

let callback
let inline
let command
let text

const fs = require('fs')

beforeAll(async () => {
    process.env.NODE_ENV = 'test'
    const ActionHero = require('actionhero')
    actionhero = new ActionHero.Process()
    api = await actionhero.start()
    await api.r.table('users').delete().run()
    await api.r.table('telegram').delete().run()
    connection = new api.specHelper.Connection()

    Bot = require('../../lib/bot')

    callback = JSON.parse(fs.readFileSync(__dirname + '/../httpMock/telegram/callback.json'))
    inline   = JSON.parse(fs.readFileSync(__dirname + '/../httpMock/telegram/inline.json'))
    command  = JSON.parse(fs.readFileSync(__dirname + '/../httpMock/telegram/command.json'))
    text     = JSON.parse(fs.readFileSync(__dirname + '/../httpMock/telegram/text.json'))
})

afterAll(async () => {
    await actionhero.stop()
})

it('Bot parses Incoming requests', async () => {
  const botClient = new Bot(api, command)
  const session = await botClient.loadSession()

  expect(botClient.ctx.message.text).toEqual('/command')
})

it('Bot sets, saves and deletes internal state', async () => {
  const botClient = new Bot(api, command)
  let session = await botClient.loadSession()

  session.foo = 'bar'
  botClient.saveSession()

  expect(session.foo).toEqual('bar')
  session = botClient.initDB()
  await botClient.saveSession()

  //Delete Session
  session = await botClient.loadSession()
  expect(session.foo).toBeUndefined()
})

it('Bot state differs for different users', async () => {
  let command2 = api._.cloneDeep(command)
      command2.message.from.id = 400
  
  const botClient = new Bot(api, command)
  botClient.ctx.db.user_id = 404
  let session = await botClient.loadSession()

  const botClient2 = new Bot(api, command2)
  botClient2.ctx.db.user_id = 400
  let session2 = await botClient2.loadSession()
  
  session.foo = 'bar'
  await botClient.saveSession()

  session2.foo = 'bar2'
  await botClient2.saveSession()

  session = undefined
  session2 = undefined

  //Delete Session
  session = await botClient.loadSession()
  session2 = await botClient2.loadSession()
  
  expect(session.foo).toEqual('bar')
  expect(session2.foo).toEqual('bar2')
})