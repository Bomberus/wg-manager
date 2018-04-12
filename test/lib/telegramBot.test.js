let connection
let api
let actionhero
let Bot

let callback
let inline
let command
let text
let location

const fs = require('fs')
const nock = require('nock')

beforeAll(async () => {
    nock.disableNetConnect()
    nock('https://geocoder.cit.api.here.com')
      .get(/.*/)
      .replyWithFile(200, __dirname + '/../httpMock/geocoder.json', {'Content-Type': 'application/json', 'access-control-allow-origin': '*'})
    nock('https://creativecommons.tankerkoenig.de/json/list.php')
      .get(/.*/)
      .replyWithFile(200, __dirname + '/../httpMock/tanken/stations.json', {'Content-Type': 'application/json', 'access-control-allow-origin': '*'})
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
    location = JSON.parse(fs.readFileSync(__dirname + '/../httpMock/telegram/location.json'))
})

afterAll(async () => {
    await actionhero.stop()
    nock.cleanAll()
    nock.enableNetConnect()
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

it('Check Callback', async () => {
  expect(true).toBeTruthy()
})

it('Check Message', async () => {
    const botClient = new Bot(api, text)
    
    // No command given => show help
    const TelegramAction = await botClient.handleUpdate()
    expect(TelegramAction.command).toEqual('sendMessage')
    expect(TelegramAction.data[0]).toEqual(text.message.chat.id)
    expect(TelegramAction.data[1]).toEqual(botClient.listRules())
})

it('Check Inline', async () => {
  let botClient = new Bot(api, inline)

  // Wrong command => empty action 
  let TelegramAction = await botClient.handleUpdate()
  expect(TelegramAction).toBeUndefined()

  inline.inline_query.query = "ts Berlin Alexanderplatz",
  botClient = new Bot(api, inline)
  TelegramAction = await botClient.handleUpdate()
  expect(TelegramAction.command).toEqual('answerInlineQuery')
  expect(TelegramAction.data[0]).toEqual(inline.inline_query.id)
  expect(TelegramAction.data[1]).toHaveLength(4)
})