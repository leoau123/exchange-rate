'use strict';

exports.methodNotAllowed = function(req, res) {
    let errorJson = {
        "success": false,
        "error": {
            "code": 405,
            "info": "The method was not allowed for this requested API endpoint."
        }
    };
    
    res.status(405);
    res.json(errorJson);
  };

exports.notFound = function(req, res) {
    let errorJson = {
        "success": false,
        "error": {
            "code": 404,
            "info": "The requested resource does not exist."
        }
    };

    res.status(404);
    res.json(errorJson);
};