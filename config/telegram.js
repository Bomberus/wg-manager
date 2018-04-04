exports.default = { 
  telegram: function(api){
    return {
      token: process.env.TELEGRAM_BOT_TOKEN
    }
  }
}

exports.test = { 
  telegram: function(api){
    return {
      token: 404
    }
  }
}