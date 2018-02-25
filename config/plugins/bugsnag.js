exports.default = {
  bugsnag: function(api){
    return {
      apiKey: 'f31d3c003d8b6da6678c60a8525408e8',
      options: {
        useSSL: true,
        releaseStage: api.env,
        notifyReleaseStages: ['production', 'staging'],
      },
    }
  }
}
