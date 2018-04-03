const nock = require('nock')
let api
let actionhero

beforeAll(async () => {
    nock.disableNetConnect()
    nock('https://geocoder.cit.api.here.com')
      .get(/.*/)
      .replyWithFile(200, __dirname + '/../httpMock/geocoder.json', {'Content-Type': 'application/json', 'access-control-allow-origin': '*'})
    
    nock('https://route.cit.api.here.com')
      .get(/.*/)
      .replyWithFile(200, __dirname + '/../httpMock/calculateRoute.json', {'Content-Type': 'application/json', 'access-control-allow-origin': '*'})
    process.env.NODE_ENV = 'test'
    const ActionHero = require('actionhero')
    actionhero = new ActionHero.Process()
    api = await actionhero.start()
})

afterAll(async () => {
    await actionhero.stop()
    nock.cleanAll()
    nock.enableNetConnect()
})

it('Test Geocoder', async () => {
    const geodata = await api.here.geocode('Test')
    expect(geodata[0].location.address.country).toEqual('DEU')
})

it('Test Route Calc', async () => {
  const routedata = await api.here.calculateRoute('111','2222')
  expect(routedata.trafficNote).toHaveLength(2)
})