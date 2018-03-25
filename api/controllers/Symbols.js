'use strict';

var utils = require('../../lib/Utils'),
  logger = require('../../server').logger('Sysmbols'),
  uuidv1 = require('uuid/v1');
  
exports.check = function(req, res) {
    let startProcessTime = new Date();
    let uuid = uuidv1();
    let appID = typeof req.query.app_id !== 'undefined' ? req.query.app_id : "";
    let code = typeof req.params.code !== 'undefined' ? req.params.code.toUpperCase() : null;
    let prettyprint = typeof req.query.prettyprint !== 'undefined' ? (req.query.prettyprint.toLowerCase() == 'true') : false;
    logger.info(uuid+"|New incomming request|IP:"+req.connection.remoteAddress+"|URL:"+req.originalUrl+
        "|appID:"+appID+"|code:"+code+"|prettyprint:"+prettyprint);
    let responseJson = {};
    if(code == null){
        responseJson = {
            'success': true,
            'timestamp': new Date().getTime(),
            'date': utils.dateToString(new Date()),
            'symbols': utils.code2Name
        };
        logger.info(uuid+"|Show all symbols");
    }
    else if(code in utils.code2Name){
        let symbol = {}
        symbol[code] = utils.code2Name[code];
        responseJson = {
            'success': true,
            'timestamp': new Date().getTime(),
            'date': utils.dateToString(new Date()),
            'symbols': symbol
        };
        logger.info(uuid+"|Symbol Found|Code:"+code+"|Name:"+utils.code2Name[code]);
    }
    else{
        responseJson = {
            'success': false,
            'timestamp': new Date().getTime(),
            'date': utils.dateToString(new Date()),
            'error': {
                'code': 107,
                'message': 'No symbol was found.'
            }
        };
        logger.info(uuid+"|No symbol was found|code:"+code);
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
}

exports.code = function(req, res){
    let startProcessTime = new Date();
    let uuid = uuidv1();
    let appID = typeof req.query.app_id !== 'undefined' ? req.query.app_id : "";
    let name = typeof req.params.name !== 'undefined' ? req.params.name : null;
    let prettyprint = typeof req.query.prettyprint !== 'undefined' ? (req.query.prettyprint.toLowerCase() == 'true') : false;
    logger.info(uuid+"|New incomming request|IP:"+req.connection.remoteAddress+"|URL:"+req.originalUrl+
        "|appID:"+appID+"|name:"+name+"|prettyprint:"+prettyprint);
        let responseJson = {};
        if(name == null){
            responseJson = {
                'success': true,
                'timestamp': new Date().getTime(),
                'date': utils.dateToString(new Date()),
                'symbols': utils.name2Code
            };
            logger.info(uuid+"|Show all symbols");
        }
        else if(name in utils.name2Code){
            let symbol = {}
            symbol[name] = utils.name2Code[name];
            responseJson = {
                'success': true,
                'timestamp': new Date().getTime(),
                'date': utils.dateToString(new Date()),
                'symbols': symbol
            };
            logger.info(uuid+"|Symbol Found|Code:"+utils.name2Code[name]+"|Name:"+name);
        }
        else{
            responseJson = {
                'success': false,
                'timestamp': new Date().getTime(),
                'date': utils.dateToString(new Date()),
                'error': {
                    'code': 107,
                    'message': 'No symbol was found.'
                }
            };
            logger.info(uuid+"|No symbol was found|name:"+name);
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
}