'use strict';

var mongoose = require('mongoose'),
  utils = require('../../lib/Utils'),
  Rates = mongoose.model('Rates'),
  logger = require('../../server').logger('Convert'),
  uuidv1 = require('uuid/v1');

exports.convert = function(req, res) {
  let startProcessTime = new Date();
  let uuid = uuidv1();
  let dateString = req.query.date !== 'undefined' ? req.query.date : null;
  let appID = typeof req.query.app_id !== 'undefined' ? req.query.app_id : "";
  let from = typeof req.query.from !== 'undefined' ? req.query.from.toUpperCase() : null;
  let to = typeof req.query.to !== 'undefined' ? req.query.to.toUpperCase() : null;
  let amount = typeof req.query.amount !== 'undefined' ? req.query.amount : null;
  let prettyprint = typeof req.query.prettyprint !== 'undefined' ? (req.query.prettyprint.toLowerCase() == 'true') : false;
  logger.info(uuid+"|New incomming request|IP:"+req.connection.remoteAddress+"|URL:"+req.originalUrl+
  "|Date:"+dateString+"|appID:"+appID+"|from:"+from+"|to:"+to+"|prettyprint:"+prettyprint);
  // Return 400 Bad Request for missng request from/to/amount
  if(from == null || to == null || amount == null){
    let errorJson = {
      "success": false,
      "error": {
          "code": 401,
          "info": "Missing the request from/to/amount."
      }
    };
    res.status(400);
    res.send(errorJson);
  }
  else{
    // ToDo: Authenication and Permission Checking
    // Check amount format
    if(utils.isNumericString(amount)){
      amount = Number(amount);
      // Check from and to
      if(!(from in utils.code2Name) || !(to in utils.code2Name)){
        // 203: Invalid from/to currency
        let responseJson = {
          "success": false,
          "error": {
            "code": 203,
            "message": "An invalid from/to currency has been entered."
          }
        };
        logger.warn(uuid+"|Invalid from/to currency has been entered|from:"+from+"|to:"+to);
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
      // Do convert in latest way
      if(dateString == null){
        let startQueryTime = new Date();
        // Query latest rates (Find one document with date descing)
        Rates.findOne({'base': from}).sort({'date': -1}).exec(function (err, data){
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
            if(to in data.rates){
              responseJson = {
                "success": false,
                "from": from,
                "to": to,
                "amount": amount,
                "timestamp": data.date.getTime(),
                "date": utils.dateToString(data.date),
                "rate": data.rates[to],
                "result": amount * data.rates[to]
              }
            }
            else{
              logger.warn(uuid+"|Rate "+to+" was not found");
              responseJson = {
                "success": false,
                "from": from,
                "to": to,
                "amount": amount,
                "error": {
                  "code": 106,
                  "message": "The current request did not return any results."
                }
              }
            }
            logger.info(uuid+"|Query Success|elapsedTime:"+
              (new Date().getTime()-startQueryTime.getTime())+"ms");
          }
          else{
            // Query Success with no data response
            responseJson = {
              "success": false,
              "from": from,
              "to": to,
              "amount": amount,
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
      // Do convert in historical way
      // Check date format
      else if(dateString != null && !utils.dateValidation(dateString)){
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
        let startQueryTime = new Date();
        // Query historical rates (filter by date)
        Rates.findOne({'base': from, 'date': {"$gte": startDate, "$lte": endDate}}).exec(function (err, data){
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
            if(to in data.rates){
              responseJson = {
                "success": false,
                "from": from,
                "to": to,
                "amount": amount,
                "timestamp": data.date.getTime(),
                "date": utils.dateToString(data.date),
                "rate": data.rates[to],
                "result": amount * data.rates[to]
              }
            }
            else{
              logger.warn(uuid+"|Rate "+to+" was not found");
              responseJson = {
                "success": false,
                "from": from,
                "to": to,
                "amount": amount,
                "error": {
                  "code": 106,
                  "message": "The current request did not return any results."
                }
              }
            }
            logger.info(uuid+"|Query Success|elapsedTime:"+
              (new Date().getTime()-startQueryTime.getTime())+"ms");
          }
          else{
            // Query Success with no data response
            responseJson = {
              "success": false,
              "from": from,
              "to": to,
              "amount": amount,
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
    }
    else{
      // 204: Invalid amount
      let responseJson = {
        "success": false,
        "error": {
          "code": 204,
          "message": "An invalid amount has been entered."
        }
      };
      logger.warn(uuid+"|Invalid amount has been entered|amount:"+amount);
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