const r = require('rethinkdbdash')({
    port: 28015,
    host: 'localhost',
    user: 'admin',
    password: ''
})

function setup () {
    return new Promise(async ( resolve, reject ) => {
        try {
            await r.dbCreate("test").run()
            console.log("Creating test db")
            await r.db("test").tableCreate("users").run()
            console.log("Creating test tables")
            await r.db('rethinkdb').table('users').insert({id: 'test', password: 'test'}).run()
            console.log("Insert Test User")
            await r.db("test").grant('test', {write: true, read: true}).run()
            console.log("Grant Test User access to DB")

            await r.getPoolMaster().drain()
            resolve(true)
        } catch(e) {
            resolve(false)
        }
    })
}

setup().then((ok) => {
    ok ? process.exit(0) : process.exit(1)
})