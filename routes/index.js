// const dhtRoute = require('./dht')
// const uvRoute = require('./uv')
const rainRoute = require('./rain')

function route(app) {
  app.use('/api/rain', rainRoute)
  // app.use('/api/uv', uvRoute)
  // app.use('/api/dht', dhtRoute)
}

module.exports = route
