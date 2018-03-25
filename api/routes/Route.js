'use strict';
module.exports = function(app) {
  var latest = require('../controllers/Latest'),
    errorRouteHandling = require('../controllers/ErrorRouteHandling'),
    historical = require('../controllers/Historical'),
    convert = require('../controllers/Convert'),
    symbols = require('../controllers/Symbols'),
    timeseries = require('../controllers/Timeseries');

  // Latest Routes
  app.route('/latest/')
    .get(latest.latest)
    .all(errorRouteHandling.methodNotAllowed);

  // Historical Routes
  app.route('/historical/:date')
    .get(historical.historical)
    .all(errorRouteHandling.methodNotAllowed);
  
  // Historical Routes without date parameter
  app.route('/historical')
    .get(historical.historicalMissDate)
    .all(errorRouteHandling.methodNotAllowed);

  // Convert Route
  app.route('/convert')
    .get(convert.convert)
    .all(errorRouteHandling.methodNotAllowed);

  // Code Route
  app.route('/code/:code?')
    .get(symbols.code)
    .all(errorRouteHandling.methodNotAllowed);
  
  // Name Route
  app.route('/name/:name?')
  .get(symbols.name)
  .all(errorRouteHandling.methodNotAllowed);

  // Timeserises Route
  app.route('/timeseries/:start/:end')
  .get(timeseries.timeseries)
  .all(errorRouteHandling.methodNotAllowed);

  // Timeserises Routes without start/end parameter
  app.route('/timeseries')
  .get(timeseries.timeseriesMissDate)
  .all(errorRouteHandling.methodNotAllowed);
  
  // Other Routes
  app.route('*')
    .all(errorRouteHandling.notFound);
};
