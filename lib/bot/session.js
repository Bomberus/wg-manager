class Session {
    constructor(api, ctx) {
        this.session = undefined
        this.r = api.r
        this.user_id = ctx.message.from.id
        this.chat_id = ctx.message.chat.id
    }

    async get(){
        const result = await this.r.table('telegram').get(this.user_id+'@'+this.chat_id).run()
        if (result) {
            this.session = result
        } else {
            this.init()
        }
        return this.session
    }

    async save() {
        await this.r.table('telegram').insert( this.session, {conflict: 'replace'}).run() 
    }

    init(){
        this.session = {
            id: this.user_id+'@'+this.chat_id,
            action: '',
            params: {},
            pendingInput: ''
        }
    }
}

module.exports = Session