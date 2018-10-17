import "@babel/polyfill";

const http = require('http')
// import http from 'http' // ES6 syntax

const requestHandler = function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end('Hello, World')
}
const server = http.createServer(requestHandler)
server.listen(8080);

