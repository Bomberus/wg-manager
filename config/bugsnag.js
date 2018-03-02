exports.default = {
  bugsnag: function(api){
    return {
      apiKey: process.env.BUGSNAG_TOKEN,
      enabled: process.env.BUGSNAG_ENABLED || false,
      options: {
        useSSL: true,
        releaseStage: api.env,
        notifyReleaseStages: ['production', 'staging'],
      },
    }
  }
}
