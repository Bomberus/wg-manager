const {Initializer, api} = require('actionhero')
const bcrypt = require('bcrypt')

module.exports = class UserInit extends Initializer {
  constructor () {
    super()
    this.name = 'user'
    this.loadPriority = 1000
    this.startPriority = 1000
    this.stopPriority = 1000
  }

  async initialize () { 
    api.user = {}
    api.user.isBot = (connection) => {
        return connection.type === 'bot'
    },
    
    api.user.findByEmail = (email) => {
        return new Promise(async ( resolve ) => {
            const findUser = await api.r.table('users').filter(api.r.row('email').eq(email)).run()
            if (findUser.length === 1){
                resolve(findUser[0])
            }
            else {
                resolve(undefined)
            }
        })
    },
    api.user.authenticate = (email, password) => {
        return new Promise(async ( resolve, reject ) => { 
            const user = await api.user.findByEmail(email)
            if (user) {
                const bAuthenticated = await bcrypt.compare(password, user.password)
                if (bAuthenticated)
                {
                    api.jwtauth.generateToken({id: user.id }, api.config.jwtauth.options, (token) => {
                        resolve('Token ' + token)
                    })
                } else {
                    reject('Wrong Password')
                }   
            } else {
                api.log('User not found','error',this.name)
                reject('User not found')
            }
        })
    },
    api.user.create = async (email, password) => {
        const user = await api.user.findByEmail(email)
        if (!user) {
            // hash the password along with our new salt
            const hash = await bcrypt.hash(password, api.config.general.saltRounds)
            await api.r.table('users').insert({email,
                                                password: hash}).run()
            
                    
            try {
                await api.user.authenticate(email, password)
            } catch (e) {throw e}
        }
        else {
            throw new Error('User already registered') 
        }
    },
    api.user.getCurrentUser = (connection) => {
        return new Promise( async (resolve) => { 
            if (connection._jwtTokenData) {
                const id = connection._jwtTokenData.id
                const user = await api.r.table('users').get(id).run()
                resolve(user)
            }
            else {
                resolve(undefined)
            }
        });
    },
    api.user.delete = async (connection) => {
        const user = await api.user.getCurrentUser(connection)
        if (user) {
            await api.r.table('users').get(user.id).delete().run()
        }
    }
  }

  async start () {
    api.log('I started', 'info', this.name)
  }

  async stop () {
    api.log('I stopped', 'info', this.name)
  }
}