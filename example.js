// Generated by CoffeeScript 1.9.2
var whakaruru;

whakaruru = require('./verbose');

whakaruru(function() {
  var app, mutunga, server;
  mutunga = require('http-mutunga');
  app = function(req, res) {
    return res.end('Ok.');
  };
  return server = mutunga(app).listen(8080, function() {
    var shutdown;
    console.log(process.pid + " Listening");
    shutdown = function() {
      console.log(process.pid + " Waiting for requests to finish");
      return server.close(function() {
        console.log(process.pid + " Exiting");
        return process.exit(0);
      });
    };
    process.on('SIGTERM', shutdown);
    return process.on('SIGINT', shutdown);
  });
});