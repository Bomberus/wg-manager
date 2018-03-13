exports.default = { 
  telegram: function(api){
    return {
      token: process.env.TELEGRAM_BOT_TOKEN,
      userid: process.env.TELEGRAM_ID
    }
  }
}

exports.test = { 
  telegram: function(api){
    return {
      token: process.env.TELEGRAM_BOT_TOKEN
    }
  }
}