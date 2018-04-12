const ActionHero = require('actionhero')
process.env.NODE_ENV = 'test'
module.exports = async function () {
    try {
        //Nock Setup
        console.log("Global Test setup")
        console.log(process.env.NODE_ENV)
        
        console.log('JEST global setup')
    }
    catch(e) {
        console.log(e)
    }
}
