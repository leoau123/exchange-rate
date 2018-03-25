process.env.NODE_ENV = 'test';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var mongoose = require("mongoose");

//Require the dev-dependencies
var chai = require('chai'),
  server = require('../server')
  chaiHttp = require('chai-http'),
  should = chai.should();

chai.use(chaiHttp);

describe('Historical without date', () => {
    it('it should return 404 bad request', (done) => {
      setTimeout(function(){
        chai.request("https://localhost:3000")
            .get('/historical')
            .end((err, res) => {
                res.should.have.status(400);
                res.text.should.equal('{"success":false,"error":{"code":302,"info":"Missing the request date."}}');
                done();
            });
        },1000);
    });
});

describe('Historical', () => {
    it('it should return HKD rate on 2018-03-21', (done) => {
      setTimeout(function(){
        chai.request("https://localhost:3000")
            .get('/historical/2018-03-21?symbols=HKD')
            .end((err, res) => {
                res.should.have.status(200);
                res.text.should.equal('{"success":true,"base":"USD","timestamp":1521676799000,"date":"2018-03-21","rates":{"HKD":7.84495}}');
                done();
            });
        },1000);
    });
});