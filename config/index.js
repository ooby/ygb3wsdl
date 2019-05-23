const path = require('path')

module.exports = require('nconf')
  .argv()
  .env({
    parseValues: true,
    separator: '__'
  })
  .file(path.resolve(__dirname, './config.json'))
  .defaults({
    host: '0.0.0.0',
    port: 3001,
    sources: ['MIS'],
    rmis: {
      allowedServices: [
        'appointment-ws/appointment',
        'employees-ws/service',
        'departments-ws/departments',
        'individuals-ws/individuals',
        'locations-ws/resources',
        'services-ws/services',
        'patients-ws/patient',
        'refbooks-ws/refbooksWS',
        'rooms-ws/rooms'
      ]
    },
    mongo: {
      options: {
        socketTimeoutMS: 10000,
        keepAlive: true,
        autoReconnect: true,
        autoIndex: false,
        reconnectTries: Number.MAX_VALUE,
        useNewUrlParser: true
      }
    }
  })
