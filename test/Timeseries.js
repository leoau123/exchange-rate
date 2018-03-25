process.env.NODE_ENV = 'test';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var mongoose = require("mongoose");

//Require the dev-dependencies
var chai = require('chai'),
  server = require('../server')
  chaiHttp = require('chai-http'),
  should = chai.should();

chai.use(chaiHttp);

describe('Historical without start/end date', () => {
    it('it should return 404 bad request', (done) => {
      setTimeout(function(){
        chai.request("https://localhost:3000")
            .get('/timeseries')
            .end((err, res) => {
                res.should.have.status(400);
                res.text.should.equal('{"success":false,"error":{"code":506,"info":"No start/end has been specified."}}');
                done();
            });
        },1000);
    });
});

describe('Timeseries', () => {
    it('it should return HKD rate from 2018-03-21 to 2018-03-22', (done) => {
      setTimeout(function(){
        chai.request("https://localhost:3000")
            .get('/timeseries/2018-03-21/2018-03-22?symbols=HKD')
            .end((err, res) => {
                res.should.have.status(200);
                res.text.should.equal('{"success":true,"base":"USD","start_date":"2018-03-21","end_date":"2018-03-22","rates":{"2018-03-21":{"HKD":7.84495},"2018-03-22":{"HKD":7.84835}}}');
                done();
            });
        },1000);
    });
});