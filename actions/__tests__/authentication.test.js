let connection
let jwt_header
let api
let actionhero

beforeAll(async () => {
    const ActionHero = require('actionhero')
    actionhero = new ActionHero.Process()
    api = await actionhero.start()
    await api.r.table("users").delete().run()
    connection = new api.specHelper.Connection()
    connection.rawConnection = {
        res: {
            setHeader: ((headerName, token) => {
                jwt_header[headerName] = token
            })
        }
    }
})

beforeEach(() => {
    jwt_header = {}
})

afterAll(async () => {
    await actionhero.stop()
})

it('should have booted into the test env', () => {
    expect(process.env.NODE_ENV).toEqual('test')
    expect(api.env).toEqual('test')
    expect(api.id).toBeTruthy()
})

it('Validate field missing', async () => {
    connection.params = {
        email: "test@test.de"
    }
    let data = await api.specHelper.runAction('user:add', connection)
    expect(data.error).not.toBeUndefined()
})

it('Validate wrong repeat password', async () => {
    connection.params = {
        email: "test@test.de",
        password: "12345678",
        password_repeat: "1234567"
    }
    let data = await api.specHelper.runAction('user:add', connection)
    expect(data.error).not.toBeUndefined()
})

it('Create a new User', async () => {
    connection.params = {
        email: "test@test.de",
        password: "12345678",
        password_repeat: "12345678"
    }
    let data = await api.specHelper.runAction('user:add', connection)
    const users = await api.r.table("users").run()
    expect(users.length).toEqual(1)
    expect(jwt_header).toHaveProperty('Authorization')
})

it('User already created', async () => {
    connection.params = {
        email: "test@test.de",
        password: "12345678",
        password_repeat: "12345678"
    }
    let data = await api.specHelper.runAction('user:add', connection)
    const users = await api.r.table("users").run()
    expect(users.length).toEqual(1)
    expect(data.error).toEqual("Error: User already registered")
})

it('Authenticate wrong password', async () => {
    connection.params = {
        email: "test@test.de",
        password: "1234567"
    }
    let data = await api.specHelper.runAction('user:get', connection)
    expect(data.error).toEqual('Error: Wrong Password')
})

it('Authenticate', async () => {
    connection.params = {
        email: "test@test.de",
        password: "12345678"
    }
    let data = await api.specHelper.runAction('user:get', connection)
    expect(jwt_header).toHaveProperty('Authorization');
})

it('Delete wrong jwt', async () => {
    connection.params = {
        httpHeaders: {
            Authorization: "jwt"
        }
    }
    let data = await api.specHelper.runAction('user:delete', connection)
    expect(data.error).toEqual("Error: Invalid Authorization Header")
})

it('Delete user', async () => {
    connection.params = {
        email: "test@test.de",
        password: "12345678",
        httpHeaders: jwt_header
    }
    let data = await api.specHelper.runAction('user:get', connection)
    data = await api.specHelper.runAction('user:delete', connection)
    const users = await api.r.table("users").run()
    expect(users.length).toEqual(0)

})