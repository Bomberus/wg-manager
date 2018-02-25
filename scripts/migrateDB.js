const r = require('rethinkdbdash')({
    port: 28015,
    host: 'localhost',
    ssl: false,
    user: 'admin'
})

r.dbCreate("test")
r.db("test").tableCreate("test")
r.db('rethinkdb').table('users').insert({id: 'test', password: 'test'})
r.db("test").grant('test', {write: true, read: true})

r.getPoolMaster().drain();