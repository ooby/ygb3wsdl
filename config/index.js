const nconf = require('nconf');
const path = require('path');
nconf.argv().env().file({ file: path.join(__dirname, 'config.json') }).defaults({
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
            reconnectTries: Infinity,
            useNewUrlParser: true
        }
    }
});
module.exports = nconf;
