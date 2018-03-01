exports.default = {
  bugsnag: function(api){
    return {
      apiKey: process.env.BUGSNAG_TOKEN,
      options: {
        useSSL: true,
        releaseStage: api.env,
        notifyReleaseStages: ['production', 'staging'],
      },
    }
  }
}
