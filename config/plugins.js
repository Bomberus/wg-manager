exports['default'] = {
  plugins: (api) => {
    return {
      'ah-resque-ui': { path: __dirname + '/../node_modules/ah-resque-ui' }
    }
    /*
    If you want to use plugins in your application, include them here:

    return {
      'myPlugin': { path: __dirname + '/../node_modules/myPlugin' }
    }

    You can also toggle on or off sections of a plugin to include (default true for all sections):

    return {
      'myPlugin': {
        path: __dirname + '/../node_modules/myPlugin',
        actions: true,
        tasks: true,
        initializers: true,
        servers: true,
        public: true,
        cli: true
      }
    }
    */
  }
}
