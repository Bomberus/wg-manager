const ActionHero = require('actionhero')
process.env.NODE_ENV = 'test'
module.exports = async function () {
    try {
        console.log("Global Test setup")
        global.actionhero = new ActionHero.Process()
        console.log(process.env.NODE_ENV)

        global.api = await actionhero.start()
        console.log('JEST global setup');
    }
    catch(e) {
        console.log(e)
    }
}
