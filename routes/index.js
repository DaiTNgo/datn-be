const dhtRoute = require('./dht');
const uvRoute = require('./uv');
const rainRoute = require('./rain');
const sensorRoute = require('./sensor');
const carRoute = require('./car');

function route(app) {
  app.use('/api/rain', rainRoute);
  app.use('/api/uv', uvRoute);
  app.use('/api/dht', dhtRoute);
  app.use('/api/sensor', sensorRoute);
  app.use('/api/car', carRoute);
}

module.exports = route;
