module.exports = async function () {
    try {
        console.log("Destroy global Test setup")
        await global.actionhero.stop()
    }
    catch(e) {
        console.log(e)
    }
}