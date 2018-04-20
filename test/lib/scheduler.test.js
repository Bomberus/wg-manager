let api
let actionhero 

beforeAll(async () => {
    process.env.NODE_ENV = 'test'
    const ActionHero = require('actionhero')
    actionhero = new ActionHero.Process()
    api = await actionhero.start()
    await api.r.table('schedule').delete().run()
})

afterAll(async () => {
    await actionhero.stop()
})

it('Create a Schedule task', async () => {
  const nextOcc = api.later.schedule(api.later.parse.text('every 5 mins')).next()
  await api.scheduler.add(404, 'telegram', 'TestSchedule', 'every 5 mins', {hello: 'world'})  
  let   scheduleList = await api.scheduler.get(404, 'telegram', 'TestSchedule')
  expect(scheduleList).toHaveLength(1)
  expect(scheduleList[0].nextOcc).toEqual(nextOcc)

  await api.scheduler.remove(scheduleList[0].id)
        scheduleList = await api.scheduler.get(404, 'telegram', 'TestSchedule')
  expect(scheduleList).toHaveLength(0)
})
