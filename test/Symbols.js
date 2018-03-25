process.env.NODE_ENV = 'test';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var mongoose = require("mongoose");

//Require the dev-dependencies
var chai = require('chai'),
  server = require('../server')
  chaiHttp = require('chai-http'),
  should = chai.should();

chai.use(chaiHttp);

describe('Check', () => {
    it('it should "Hong Kong Dollar" correctly', (done) => {
      setTimeout(function(){
        chai.request("https://localhost:3000")
            .get('/check/HKD')
            .end((err, res) => {
                var json = JSON.parse(res.text);
                res.should.have.status(200);
                json.symbols['HKD'].should.equal('Hong Kong Dollar');
                done();
            });
        },1000);
    });
});

describe('Code', () => {
    it('it should "HKD" correctly', (done) => {
      setTimeout(function(){
        chai.request("https://localhost:3000")
            .get('/code/Hong Kong Dollar')
            .end((err, res) => {
                var json = JSON.parse(res.text);
                res.should.have.status(200);
                json.symbols['Hong Kong Dollar'].should.equal('HKD');
                done();
            });
        },1000);
    });
});