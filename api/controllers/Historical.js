'use strict';

var mongoose = require('mongoose'),
  utils = require('../../lib/Utils'),
  Rates = mongoose.model('Rates'),
  logger = require('../../server').logger('Historical'),
  uuidv1 = require('uuid/v1');

exports.historical = function(req, res) {
  let startProcessTime = new Date();
  let uuid = uuidv1();
  let dateString = req.params.date;
  let appID = typeof req.query.app_id !== 'undefined' ? req.query.app_id : "";
  let base = typeof req.query.base !== 'undefined' ? req.query.base.toUpperCase() : "USD";
  let symbols = typeof req.query.symbols !== 'undefined' ? req.query.symbols.toUpperCase().split(",") : [];
  let prettyprint = typeof req.query.prettyprint !== 'undefined' ? (req.query.prettyprint.toLowerCase() == 'true') : false;
  logger.info(uuid+"|New incomming request|IP:"+req.connection.remoteAddress+"|URL:"+req.originalUrl+
  "|Date:"+dateString+"|appID:"+appID+"|base:"+base+"|symbols:"+symbols+"|prettyprint:"+prettyprint);
  // ToDo: Authenication and Permission Checking
  // Check date format
  if(!utils.dateValidation(dateString)){
    // 302: Invalid date
    let responseJson = {
      "success": false,
      "error": {
        "code": 302,
        "message": "An invalid date has been specified."
      }
    }
    logger.warn(uuid+"|An invalid date has been specified|date:"+dateString);
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
    let startDate = new Date(Date.UTC(dateString.substring(0,4),
                      dateString.substring(5,7)-1,dateString.substring(8),0,0,0));
    let endDate = new Date(Date.UTC(dateString.substring(0,4),
                      dateString.substring(5,7)-1,dateString.substring(8),23,59,59));
    // check the date, if future, replace to current date
    if(startDate.getTime() > new Date().getTime()){
      startDate = new Date();
    }
    if(endDate.getTime() > new Date().getTime()){
      endDate = new Date();
    }
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
        // Query historical rates (filter by date)
        Rates.findOne({'base': base, 'date': {"$gte": startDate, "$lte": endDate}}).sort({'date': -1}).exec(function (err, data){
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
  }
};

exports.historicalMissDate = function(req, res) {
  let uuid = uuidv1();
  // Return 400 Bad Request for missing reqest date
  let prettyprint = typeof req.query.prettyprint !== 'undefined' ? (req.query.prettyprint.toLowerCase() == 'true') : false;
  let errorJson = {
    "success": false,
    "error": {
        "code": 302,
        "info": "Missing the request date."
    }
  };
  res.status(400);
  if(prettyprint){
    // Pretty JSON
    res.send(errorJson);
  }
  else{
    // Minify JSON
    res.send(JSON.stringify(errorJson, null, 0));
  }
  logger.warn(uuid+"|Missing the request date|IP:"+req.connection.remoteAddress+"|URL:"+req.originalUrl);
};