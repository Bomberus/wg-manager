exports.default = { 
    jwtauth: function(api){
      return {
        enabled: {
          web: true,
          websocket: true,
          socket: false,
          testServer: false
        },
        options: {
          expiresIn: '1d',
        },
        secret: api.config.serverToken + process.env.JWT_SECRET,
        algorithm: 'HS512',
        enableGet: false // enables token as GET parameters in addition to Authorization headers
      }
    }
  }
  
  exports.test = { 
    jwtauth: function(api){
      return {
        enabled: {
          web: true,
          websocket: true,
          socket: true,
          testServer: true
        },
        secret: api.config.serverToken + 'test',
        algorithm: 'HS512',
        enableGet: false // enables token as GET parameters in addition to Authorization headers
      }
    }
  }
  
/*  exports.production = { 
    jwtauth: function(api){
      return {
        enabled: {
          web: true,
          websocket: true,
          socket: false,
          testServer: false
        },
        secret: api.config.serverToken + process.env.JWT_SECRET,
        algorithm: 'HS512',
        enableGet: false // enables token as GET parameters in addition to Authorization headers
      }
    }
  }*/