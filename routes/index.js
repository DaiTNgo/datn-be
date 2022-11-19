const powerRoute = require('./power')

function route(app) {
  app.use('/api', powerRoute)
}

module.exports = route
