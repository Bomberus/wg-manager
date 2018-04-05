class Rules {
    constructor(api, iVersion = 1) {
        const _ = api._
        this.documentation = api.documentation.documentation
        let rules = {}
        let inline_rules = {}

        _.forEach(this.documentation,  (value, key) => {
            const oAction = value[iVersion]

            if (oAction.outputExample.enableBot) {
                rules[key] = oAction
            } else 
            if (oAction.outputExample.botInline) {
                inline_rules[oAction.outputExample.botInline] = oAction
            }
        })

        this.rules = rules
        this.inline_rules = inline_rules
    }
}

module.exports = Rules