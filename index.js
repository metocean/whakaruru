// Generated by CoffeeScript 1.9.2
var cluster;

cluster = require('cluster');

module.exports = function(cb) {
  var shutdown, toma;
  if (cluster.isWorker) {
    return cb();
  }
  toma = {};
  cluster.on('exit', function(worker) {
    if (toma[worker.id.toString()] == null) {
      cluster.fork();
    }
    if (Object.keys(cluster.workers).length === 0) {
      return process.exit();
    }
  });
  cluster.fork();
  process.on('SIGHUP', function() {
    var worker;
    worker = cluster.fork();
    return worker.once('listening', function(address) {
      var child, id, ref, results;
      ref = cluster.workers;
      results = [];
      for (id in ref) {
        child = ref[id];
        if (id === worker.id.toString()) {
          continue;
        }
        toma[id.toString()] = true;
        results.push(child.process.kill());
      }
      return results;
    });
  });
  shutdown = function() {
    var child, id, ref, results;
    ref = cluster.workers;
    results = [];
    for (id in ref) {
      child = ref[id];
      toma[id.toString()] = true;
      results.push(child.process.kill());
    }
    return results;
  };
  process.on('SIGINT', shutdown);
  return process.on('SIGTERM', shutdown);
};
