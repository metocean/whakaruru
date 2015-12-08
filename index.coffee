cluster = require 'cluster'

module.exports = (cb) ->
  return cb() if cluster.isWorker

  toma = {}
  #console.log "#{process.pid} Tētē kura"
  cluster.on 'exit', (worker) ->
    if !toma[worker.id.toString()]?
      cluster.fork()
  cluster.fork()
  process.on 'SIGHUP', ->
    worker = cluster.fork()
    worker.once 'listening', (address) ->
      for id, child of cluster.workers
        continue if id == worker.id.toString()
        toma[id.toString()] = yes
        child.process.kill()
  shutdown = ->
    for id, child of cluster.workers
      toma[id.toString()] = yes
      child.process.kill()
  process.on 'SIGINT', shutdown
  process.on 'SIGTERM', shutdown
