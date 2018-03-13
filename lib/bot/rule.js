class Rules {
    constructor(api, iVersion = 1) {
        const _ = api._
        this.documentation = api.documentation.documentation
        let rules = {}

        _.forEach(this.documentation,  (value, key) => {
            const oAction = value[iVersion]

            if (oAction.outputExample.enableBot) {
                rules[key] = oAction
            }
        })
        this.rules = rules
    }
}

module.exports = Rules