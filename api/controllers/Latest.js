'use strict';

var mongoose = require('mongoose'),
  utils = require('../../lib/Utils'),
  Rates = mongoose.model('Rates'),
  logger = require('../../server').logger('Latest'),
  uuidv1 = require('uuid/v1');

exports.latest = function(req, res) {
  let startProcessTime = new Date();
  let uuid = uuidv1();
  let appID = typeof req.query.app_id !== 'undefined' ? req.query.app_id : "";
  let base = typeof req.query.base !== 'undefined' ? req.query.base.toUpperCase() : "USD";
  let symbols = typeof req.query.symbols !== 'undefined' ? req.query.symbols.toUpperCase().split(",") : [];
  let prettyprint = typeof req.query.prettyprint !== 'undefined' ? (req.query.prettyprint.toLowerCase() == 'true') : false;
  logger.info(uuid+"|New incomming request|IP:"+req.connection.remoteAddress+"|URL:"+req.originalUrl+
    "|appID:"+appID+"|base:"+base+"|symbols:"+symbols+"|prettyprint:"+prettyprint); 
  // ToDo: Authenication and Permission Checking
  // Check the base
  if(base in utils.code2Name){
    let invalidSymbols = false;
    if(symbols.length > 0){
      let i = 0;
      // Check each symbol
      while(!invalidSymbols && i < symbols.length){
        if(!(symbols[i] in utils.code2Name)){
          invalidSymbols = true;
        }
        i++;
      }
    }
    if(invalidSymbols){
      // 202: One or more invalid symbols
      let responseJson = {
        "success": false,
        "error": {
          "code": 202,
          "message": "One or more invalid symbols have been specified."
        }
      };
      logger.warn(uuid+"|One or more invalid symbols have been specified|symbols:"+symbols);
      if(prettyprint){
        // Pretty JSON
        res.send(responseJson);
      }
      else{
        // Minify JSON
        res.send(JSON.stringify(responseJson, null, 0));
      }
      logger.info(uuid+"|Response success|statusCode:"+res.statusCode+
            "|elapsedTime:"+(new Date().getTime()-startProcessTime.getTime())+"ms");
    }
    else{
      let startQueryTime = new Date();
      // Query latest rates (Find one document with date descing)
      Rates.findOne({'base': base}).sort({'date': -1}).exec(function (err, data){
        let responseJson = {};
        if(err){
          // Query with error response
          res.status(500);
          responseJson = {
            "success": false,
            "error": {
              "code": 500,
              "message": "Internal Server Error"
            }
          }
          logger.error(uuid+"|Query DB with error|elapsedTime:"+
            (new Date().getTime()-startQueryTime.getTime())+"ms|error:"+err);
        }
        else if(data){
          // Query Success with data response
          let rates = {};
          if(symbols.length > 0){
            for(let symbol of symbols){
              if(symbol in data.rates){
                rates[symbol] = data.rates[symbol];
              }
              else{
                logger.warn(uuid+"|Rate "+symbol+" was not found");
              }
            }
          }
          else{
            rates = data.rates;
          }
          responseJson = {
            "success": true,
            "base": base,
            "timestamp": data.date.getTime(),
            "date": utils.dateToString(data.date),
            "rates": rates
          }
          logger.info(uuid+"|Query Success|elapsedTime:"+
            (new Date().getTime()-startQueryTime.getTime())+"ms");
        }
        else{
          // Query Success with no data response
          responseJson = {
            "success": false,
            "base": base,
            "error": {
              "code": 106,
              "message": "The current request did not return any results."
            }
          }
          logger.warn(uuid+"|Query Success with no result|elapsedTime:"+
            (new Date().getTime()-startQueryTime.getTime())+"ms");
        }
        if(prettyprint){
          // Pretty JSON
          res.send(responseJson);
        }
        else{
          // Minify JSON
          res.send(JSON.stringify(responseJson, null, 0));
        }
        logger.info(uuid+"|Response success|statusCode:"+res.statusCode+
          "|elapsedTime:"+(new Date().getTime()-startProcessTime.getTime())+"ms");
      });
    } 
  }else{
    // 201: Invalid base currency
    let responseJson = {
      "success": false,
      "error": {
        "code": 201,
        "message": "An invalid base currency has been entered."
      }
    };
    logger.warn(uuid+"|Invalid base currency has been entered|base:"+base);
    if(prettyprint){
      // Pretty JSON
      res.send(responseJson);
    }
    else{
      // Minify JSON
      res.send(JSON.stringify(responseJson, null, 0));
    }
    logger.info(uuid+"|Response success|statusCode:"+res.statusCode+
          "|elapsedTime:"+(new Date().getTime()-startProcessTime.getTime())+"ms");
  }
};