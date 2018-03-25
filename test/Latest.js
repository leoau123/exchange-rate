process.env.NODE_ENV = 'test';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var mongoose = require("mongoose");

//Require the dev-dependencies
var chai = require('chai'),
  server = require('../server')
  chaiHttp = require('chai-http'),
  should = chai.should();

chai.use(chaiHttp);

describe('Latest', () => {
    it('it should latest HKD rate', (done) => {
      setTimeout(function(){
        chai.request("https://localhost:3000")
            .get('/latest?symbols=HKD')
            .end((err, res) => {
                res.should.have.status(200);
                res.text.should.equal('{"success":true,"base":"USD","timestamp":1521824399000,"date":"2018-03-23","rates":{"HKD":7.84624}}');
                done();
            });
        },1000);
    });
});