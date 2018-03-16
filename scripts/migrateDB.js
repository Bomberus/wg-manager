const r = require('rethinkdbdash')({
    port: 28015,
    host: 'localhost'
})

function setup () {
    return new Promise(async ( resolve, reject ) => {
        try {
            const dbExists = await r.dbList().contains("test").run()
            if (dbExists)
                await r.dbDrop("test").run()
            await r.dbCreate("test").run()
            console.log("Creating test db")
            
            ["test","telegram","inventory"].forEach(async(sTable) => {
                const tableExists = await r.db("test").tableList().contains(sTable).run()
                if (tableExists)
                    await r.db("test").tableDrop(sTable).run()
                await r.db("test").tableCreate(sTable).run()
            })
            
            console.log("Creating test tables")
            await r.db("rethinkdb").table('users').contains("test").do(function(user){
                return r.db("rethinkdb").table('users').get("test").delete()
                 }).run()
            await r.db("rethinkdb").table('users').insert({id: 'test', password: 'test'}).run()
            console.log("Insert Test User")
            await r.db("test").grant('test', {write: true, read: true}).run()
            console.log("Grant Test User access to DB")

            await r.getPoolMaster().drain()
            resolve(true)
        } catch(e) {
            console.log(e.message)
            resolve(false)
        }
    })
}

setup().then((ok) => {
    ok ? process.exit(0) : process.exit(1)
})