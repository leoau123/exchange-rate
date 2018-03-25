'use strict';
const MAX_TIME_FRAME = 31622399000;

var mongoose = require('mongoose'),
  utils = require('../../lib/Utils'),
  Rates = mongoose.model('Rates'),
  logger = require('../../server').logger('Timeseries'),
  uuidv1 = require('uuid/v1');

exports.timeseries = function(req, res) {
  let startProcessTime = new Date();
  let uuid = uuidv1();
  let startDateString = req.params.start;
  let endDateString = req.params.end;
  let appID = typeof req.query.app_id !== 'undefined' ? req.query.app_id : "";
  let base = typeof req.query.base !== 'undefined' ? req.query.base.toUpperCase() : "USD";
  let symbols = typeof req.query.symbols !== 'undefined' ? req.query.symbols.toUpperCase().split(",") : [];
  let prettyprint = typeof req.query.prettyprint !== 'undefined' ? (req.query.prettyprint.toLowerCase() == 'true') : false;
  logger.info(uuid+"|New incomming request|IP:"+req.connection.remoteAddress+"|URL:"+req.originalUrl+
  "|startDate:"+startDateString+"|endDate"+endDateString+"|appID:"+appID+"|base:"+base+"|symbols:"+symbols+"|prettyprint:"+prettyprint);
  // ToDo: Authenication and Permission Checking
  // Check date format
  if(!utils.dateValidation(startDateString)){
    // 502: Invalid start date
    let responseJson = {
      "success": false,
      "error": {
        "code": 502,
        "message": "An invalid start has been specified."
      }
    }
    logger.warn(uuid+"|An invalid date has been specified|startDate:"+startDateString);
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
  else if(!utils.dateValidation(endDateString)){
    // 503: Invalid end date
    let responseJson = {
      "success": false,
      "error": {
        "code": 503,
        "message": "An invalid end has been specified"
      }
    }
    logger.warn(uuid+"|An invalid end has been specified|endDate:"+endDateString);
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
  else if(new Date(Date.UTC(startDateString.substring(0,4),
    startDateString.substring(5,7)-1,startDateString.substring(8),0,0,0)).getTime() > 
    new Date(Date.UTC(endDateString.substring(0,4),
    endDateString.substring(5,7)-1,endDateString.substring(8),23,59,59)).getTime()){
      // 504: Invalid timeframe
      let responseJson = {
        "success": false,
        "error": {
          "code": 504,
          "message": "An invalid timeframe has been specified."
        }
      }
      logger.warn(uuid+"|An invalid timeframe has been specified|startDate:"+startDateString+
        "|endDate:"+endDateString);
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
  else if(new Date(Date.UTC(endDateString.substring(0,4),
    endDateString.substring(5,7)-1,endDateString.substring(8),23,59,59)).getTime() - 
    new Date(Date.UTC(startDateString.substring(0,4),
    startDateString.substring(5,7)-1,startDateString.substring(8),0,0,0)).getTime() > MAX_TIME_FRAME){
      // 504: Invalid timeframe
      let responseJson = {
        "success": false,
        "error": {
          "code": 504,
          "message": "The specified timeframe is too long, exceeding 365 days."
        }
      }
      logger.warn(uuid+"|The specified timeframe is too long, exceeding 365 days|startDate:"+startDateString+
        "|endDate:"+endDateString+"|max_time_frame:"+MAX_TIME_FRAME);
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
    let startDate = new Date(Date.UTC(startDateString.substring(0,4),
                      startDateString.substring(5,7)-1,startDateString.substring(8),0,0,0));
    let endDate = new Date(Date.UTC(endDateString.substring(0,4),
                      endDateString.substring(5,7)-1,endDateString.substring(8),23,59,59));
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
        // Query timeserise rates (filter by date)
        Rates.find({'base': base, 'date': {"$gte": startDate, "$lte": endDate}}).sort({'date': 1}).exec(function (err, dataSet){
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
          else if(dataSet){
            // Query Success with data response
            responseJson = {
              "success": true,
              "base": base,
              "start_date": utils.dateToString(startDate),
              "end_date": utils.dateToString(endDate),
            };
            let rates = {};
            for(let data of dataSet){
              let dailyRates = {}
              if(symbols.length > 0){
                for(let symbol of symbols){
                  if(symbol in data.rates){
                    dailyRates[symbol] = data.rates[symbol];
                  }
                  else{
                    logger.warn(uuid+"|Rate "+symbol+" was not found|Date:"+utils.dateToString(data.date));
                  }
                }
              }
              else{
                dailyRates = data.rates;
              }
              rates[utils.dateToString(data.date)] = dailyRates;
            }
            responseJson['rates'] = rates;
            logger.info(uuid+"|Query Success|elapsedTime:"+
              (new Date().getTime()-startQueryTime.getTime())+"ms");
          }
          else{
            // Query Success with no data response
            responseJson = {
              "success": false,
              "base": base,
              "start_date": utils.dateToString(startDate),
              "end_date": utils.dateToString(endDate),
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

exports.timeseriesMissDate = function(req, res) {
  // Return 400 Bad Request for missing reqest start date and end date
  let prettyprint = typeof req.query.prettyprint !== 'undefined' ? (req.query.prettyprint.toLowerCase() == 'true') : false;
  let errorJson = {
    "success": false,
    "error": {
        "code": 506,
        "info": "No start/end has been specified."
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
  logger.warn(uuid+"|No start/end has been specified|IP:"+req.connection.remoteAddress+"|URL:"+req.originalUrl);
};