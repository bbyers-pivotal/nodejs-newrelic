'use strict';

var licenseKey = '';
if (process.env.VCAP_SERVICES) {
  var a = process.env.VCAP_SERVICES;
  var json = JSON.parse(a);
  if (json.newrelic) {
    licenseKey = json.newrelic[0].credentials.licenseKey;
  }
}
console.log('**** NewRelic license key: ' + licenseKey);

require('newrelic');

var http    = require('http')
  , express = require('express')
  , app     = express()
  ;

app.get('/long', function (request, response) {
  var body = '<html><head><title>Testing</title></head>' +
             '<body><p>This took a bit to return.</p></body></html>';
  response.writeHead(200, {'Content-Length' : body.length, 'Content-Type' : 'text/html'});

  // let's generate some slow transaction traces
  var wait = Math.random() * 4000;
  if (wait > 2000) console.log("waiting " + wait +
                                " milliseconds to return for " + request.url);

  setTimeout(function () { response.end(body); }, wait);
});

app.get('/', function (request, response) {
  var body = '<html><head><title>Home</title></head>' +
             '<body><p>It loaded!</p></body></html>';
  response.writeHead(200, {'Content-Length' : body.length, 'Content-Type' : 'text/html'});
  response.end(body);
});

http.createServer(app).listen(process.env.PORT || 8088, function() {
  console.log('server started');
});