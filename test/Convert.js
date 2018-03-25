process.env.NODE_ENV = 'test';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var mongoose = require("mongoose");

//Require the dev-dependencies
var chai = require('chai'),
  server = require('../server')
  chaiHttp = require('chai-http'),
  should = chai.should();

chai.use(chaiHttp);

describe('check convert', () => {
    it('it should convert the amount correctly', (done) => {
      setTimeout(function(){
        chai.request("https://localhost:3000")
            .get('/convert?from=USD&to=HKD&amount=1&date=2018-03-21')
            .end((err, res) => {
                res.should.have.status(200);
                res.text.should.equal('{"success":false,"from":"USD","to":"HKD","amount":1,"timestamp":1521676799000,"date":"2018-03-21","rate":7.84495,"result":7.84495}');
                done();
            });
        },1000);
    });
});