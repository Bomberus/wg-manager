exports.default = { 
    rethinkdb: function(api){
      return {
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 28015,
        db: process.env.DB_DB || 'actionhero'
      }
    }
  }
  
  exports.test = { 
    rethinkdb: function(api){
      return {
        user: 'test',
        password: 'test',
        host: 'localhost',
        port: 28015,
        db: 'test'
      }
    }
  }