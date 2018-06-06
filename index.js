const http = require('http');
const soap = require('soap');

const nconf = require('./config');
const config = nconf.get('config');

const wsdl = require('fs').readFileSync('services.wsdl', 'utf8');
const services = require('./services');

const server = http.createServer();
server.listen(config.port, () => {
    console.log('Listening port:', config.port);
});

services(config).then(() => {
    let s = soap.listen(server, '/services', services, wsdl);
    s.log = (t, d) => {
        console.log(t, d);
    };
});

if (config.timezone) process.env.TZ = config.timezone;
