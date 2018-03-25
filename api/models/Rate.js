'use strict';
var mongoose = require('mongoose'),
  utils = require('../../lib/Utils'),
  Schema = mongoose.Schema;


var RateSchema = new Schema({
  base: {
    type: String,
    default: 'USD'
  },
  date: {
    type: Date,
    default: Date.now
  },
  rates: {
    type: Object
  }
});

module.exports = mongoose.model('Rates', RateSchema);