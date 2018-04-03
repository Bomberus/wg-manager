const ActionHero = require('actionhero')
process.env.NODE_ENV = 'test'
module.exports = async function () {
    try {
        //Nock Setup
        console.log("Global Test setup")
        let actionhero = new ActionHero.Process()
        console.log(process.env.NODE_ENV)

        await actionhero.start()
        console.log('JEST global setup')
    }
    catch(e) {
        console.log(e)
    }
}
