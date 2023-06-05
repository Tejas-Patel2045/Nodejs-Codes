var io = require("socket.io")(server, {
    upgradeTimeout: 200000 // default value is 10000ms, try changing it to 20k or more
  });
var logger = io.log;

process.on('uncaughtException', function (err) {
  if( io && io.socket ) {
     io.socket.broadcast.send({type: 'error', msg: err.toString(), stack: err.stack});
  }
  logger.error(err);
  logger.error(err.stack);

  //todo should we have some default resetting (restart server?)
  app.close();
  process.exit(-1);
});

process.on('SIGHUP', function () {
  logger.error('Got SIGHUP signal.');
  if( io && io.socket ) {
     io.socket.broadcast.send({type: 'error', msg: 'server disconnected with SIGHUP'});
  }
  //todo what happens on a sighup??
  //todo if you're using upstart, just call restart node demo_server.js
});

process.on('SIGTERM', function() {
  logger.error('Shutting down.');
  if( io && io.socket ) {
     io.socket.broadcast.send({type: 'error', msg: 'server disconnected with SIGTERM'});
  }
  app.close();
  process.exit(-1);
});