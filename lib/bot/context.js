class Context {
    constructor(api, user_id) {
        this.r = api.r
        this.user_id = user_id
    }

    async getContext(){
        const result = await this.r.table('telegram').get(this.user_id).run()
        if (result) {
            this.context = result
        } else {
            this.context = {id: this.user_id}
        }
        return this.context
    }

    async saveContext(newContext) {
        await this.r.table('telegram').insert(newContext, {conflict: 'replace'}).run() 
    }
}

module.exports = Context