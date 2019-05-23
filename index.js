const http = require('http')
const soap = require('soap')

const config = require('./config').get()
if (config.timezone) process.env.TZ = config.timezone

const wsdl = require('fs').readFileSync('services.wsdl', 'utf8')
const services = require('./services')

const server = http.createServer()
server.listen(config.port, config.host, () =>
  console.log(`Listening on ${config.host}:${config.port}`)
)

services(config)
  .then(service => {
    let s = soap.listen(server, '/services', service, wsdl)
    s.log = console.log
  })
  .catch(console.error)
