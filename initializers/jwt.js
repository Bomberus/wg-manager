/* @flow */
const jwt = require("jsonwebtoken")
const {Initializer, api} = require('actionhero')

module.exports = class AuthInit extends Initializer {
  constructor () {
    super()
    this.name = 'jwtauth'
    this.loadPriority = 1000
    this.startPriority = 1000
    this.stopPriority = 1000
  }

  async initialize () {
    api.jwtauth = {}
    api.jwtauth.processToken = async (token, success, fail) => {
        jwt.verify(token, api.config.jwtauth.secret, {}, function(err, data) {
            err ? fail(err.message) : success(data);
        });
    }
    api.jwtauth.generateToken = async (data, options, success, fail) => {

        // identify parameter format
        if ( typeof(options) === 'function') {
            fail = success;
            success = options;
            options = {};
        }
        else {
            options = options ||  {};
        }
        if (!options.algorithm) {
            options.algorithm = api.config.jwtauth.algorithm;
        }

        try {
            var token = jwt.sign(data, api.config.jwtauth.secret, options);
            if (success) {
                success(token);
            }
        }
        catch (err) {
            if (fail) {
                fail(err);
            }
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