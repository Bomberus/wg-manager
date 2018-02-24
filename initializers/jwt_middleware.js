/* @flow */
const {
    Initializer,
    api
} = require('actionhero')

module.exports = class AuthenticationMidleware extends Initializer {
    constructor() {
        super()
        this.name = 'jwt_middleware'
    }

    async initialize() {
        const middleware = {
            name: this.name,
            global: true,
            preProcessor: async (data) => {
                /*if (actionTemplate.authenticated === true) {
                  let match = await api.users.authenticate(params.userName, params.password)
                  if (!match) { throw Error('Authentication Failed.  userName and password required') }
                }*/
                // is it required to have a valid token to access an action?
                var tokenRequired = false;
                if (data.actionTemplate.authenticate && api.config.jwtauth.enabled[data.connection.type]) {
                    tokenRequired = true;
                }

                // get request data from the required sources
                var token = '';
                var req = {
                    headers: data.params.httpHeaders || (data.connection.rawConnection.req ? data.connection.rawConnection.req.headers : undefined) || data.connection.mockHeaders || {},
                    uri: data.connection.rawConnection.req ? data.connection.rawConnection.req.uri : {}
                };

                var authHeader = req.headers.authorization || req.headers.Authorization || false;

                // extract token from http headers
                if (authHeader) {
                    var parts = authHeader.split(' ');
                    if (parts.length != 2 || parts[0].toLowerCase() !== 'token') {

                        // return error if token was required and missing
                        if (tokenRequired) {
                            throw Error('Invalid Authorization Header')
                        } else {
                            return;
                        }

                    }
                    token = parts[1];
                }

                // if GET parameter for tokens is allowed, use it
                if (!token && api.config.jwtauth.enableGet && req.uri.query && req.uri.query.token) {
                    token = req.uri.query.token;
                }

                // return error if token was missing but marked as required
                if (tokenRequired && !token) {
                    throw Error('Authorization Header Not Set')
                }

                // process token and save in connection
                else if (token) {
                    api.jwtauth.processToken(token, function (tokenData) {
                        data.connection._jwtTokenData = tokenData;
                    }, (message) => {throw Error(message)});
                } else {
                    return;
                }

            },


        }
        api.actions.addMiddleware(middleware)
    }
}