process.env.NODE_ENV = 'test';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var mongoose = require("mongoose");

//Require the dev-dependencies
var chai = require('chai'),
  server = require('../server')
  chaiHttp = require('chai-http'),
  should = chai.should();

chai.use(chaiHttp);

describe('Page not found', () => {
    it('it should return 404 not found', (done) => {
      setTimeout(function(){
        chai.request("https://localhost:3000")
            .get('/wrongpath')
            .end((err, res) => {
                res.should.have.status(404);
                res.text.should.equal('{"success":false,"error":{"code":404,"info":"The requested resource does not exist."}}');
                done();
            });
        },1000);
    });
});

describe('Method not allowed', () => {
    it('it should return 405 method not allowed', (done) => {
      setTimeout(function(){
        chai.request("https://localhost:3000")
            .post('/latest')
            .end((err, res) => {
                res.should.have.status(405);
                res.text.should.equal('{"success":false,"error":{"code":405,"info":"The method was not allowed for this requested API endpoint."}}');
                done();
            });
        },1000);
    });
});