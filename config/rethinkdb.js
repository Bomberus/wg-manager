exports.default = { 
    rethinkdb: function(api){
      return {
        user: 'actionhero',
        password: 'oYoVFCr1UXN43yT0dYnb',
        host: 'localhost',
        port: 28015,
        db: 'actionhero'
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