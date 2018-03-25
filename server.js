var express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  utils = require('./lib/Utils'),
  Rates = require('./api/models/Rate'),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  https = require('https'),
  log4js = require('log4js');

if(process.env.NODE_ENV !== 'test'){
  var config = require('./config/Config'),
    port = config.port;
}
else{
  var config = require('./config/Config-test'),
    port = config.port;
}

log4js.configure({
  appenders: { system: { type: 'file', filename: config.logPath } },
  categories: { default: { appenders: ['system'], level: 'debug' } }
});
var logger = log4js.getLogger('System');

exports.logger=function(name){
  var logger = log4js.getLogger(name);
  return logger;
};

mongoose.connection.once('open', function() {
  logger.info('MongoDB event open');
  logger.debug('MongoDB connected [%s]', config.mongo.url);

  mongoose.connection.on('connected', function() {
      logger.info('MongoDB event connected');
  });

  mongoose.connection.on('disconnected', function() {
      logger.warn('MongoDB event disconnected');
  });

  mongoose.connection.on('reconnected', function() {
      logger.info('MongoDB event reconnected');
  });

  mongoose.connection.on('error', function(err) {
      logger.error('MongoDB event error: ' + err);
  });

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));
  app.set('etag', 'weak');

  let routes = require('./api/routes/Route');
  let privateKey  = fs.readFileSync(config.key, 'utf8');
  let certificate = fs.readFileSync(config.cert, 'utf8');
  let credentials = {key: privateKey, cert: certificate};

  routes(app);

  var httpsServer = https.createServer(credentials, app);

  module.exports = httpsServer.listen(port);
  logger.info('Leo Currency API server started on: ' + port); 
});

mongoose.Promise = global.Promise;
mongoose.connect(config.mongo.url, config.mongo.option, function(err) {
  // Program exit if fail to connect Mongo
  if (err) {
    logger.error('MongoDB connection error: ' + err);
    process.exit(1);
  }
});
