
'use strict';

var mongoose = require('mongoose');
    mongoose.connection.close();
    mongoose.models = {};
    mongoose.modelSchemas = {};
var request = require('supertest');
var expect = require('chai').expect;
var config = require('../config/config');
var User = require('../app/models/user');
var app = require('../server.js').app;
var _ = require('lodash');

describe('API Route', function () {

  request = request(app);

  // test user facebook token
  var fbToken = 'CAADs7qLJFH4BACmD88a6YZAT9srW54Jb8AgIHYEsHTvWmjMLQbOv47uuk6VRhRjDECpW29CXsCM7we0v4QvxveDxGZC5fkFl98iHktUZCbdO67fO8TAbEBuwjCvJBp1Ylts0BQL3ZCeAq4rVNDNJ0NCPzJiwbssCZBjZBPZAjU4cDF3ZCiTtp1LlcAPRvMpOkaNCLb6CiZAWnYAVCZCCZCsD4vu';
  var invalidFbToken = 'CAADs7qLJFH4BAGBOPz4pyopZAtTfedvNlZCwVVIvoZAVgfgaGpPQaF2FWZB3u7ZBp4eba5PP773CxzCMJGfMyaRZCqhaNAzrnoVKBJw0t9QBZCBnFSoYvXp7IYX1lneoyDm4c19tdV4q25VEwdFmbsPnto2enwJyhbrlBZCaY5goq1ngHZBMBPvYd34VC2QKnqyA7XVEocLIL8pd7MZCyYBNh2ECZBxm2GPQasZD';
  var apiAccessToken = '';

  describe('Auth', function () {
    describe('POST /api/access_token', function () {
      it('returns 400 with no grantType field', function (done) {
        request
          .post('/api/access_token')
          .expect(400, {
            "message": "Missing grantType field."
          }, done);
      });
      it('returns 400 with invalid grantType field', function (done) {
        request
          .post('/api/access_token')
          .send({
            grantType: 'invalidType',
          })
          .expect(400, {
            "message": "Invalid grant type."
          }, done);
      });
      describe('grantType: facebookToken', function () {
        it('returns 400 with facebookToken field missing', function (done) {
          request
            .post('/api/access_token')
            .send({
              grantType: 'facebookToken',
            })
            .expect(400, {
              "message": "Missing facebookToken field."
            }, done);
        });
        it('returns 400 with invalid facebook token', function (done) {
          request
            .post('/api/access_token')
            .send({
              grantType: 'facebookToken',
              facebookToken: invalidFbToken
            })
            .expect(/FacebookGraphAPIError/)
            .expect(400, done);
        });
        it('issues and retreives an access token', function (done) {
          request
            .post('/api/access_token')
            .send({
              grantType:'facebookToken',
              facebookToken: fbToken 
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
              if (err) return done(err);
              expect(res.body).to.have.property('access_token')
              .that.is.not.empty;
              expect(res.body).to.have.property('user').that.is.an('object');
              done();
            });
        });
        it('creates an user in the db', function (done) {
          User.findOne({'facebook.id': 159184434252329}, function (err, user) {
            if (err) return done(err);
            expect(user).to.be.an.instanceof(User);
            expect(user).to.have.deep
              .property('facebook.id', '159184434252329');
            done();
          });
        });
      });
      describe('grantType: password', function () {
        it('returns 400 with email field missing', function (done) {
          request
            .post('/api/access_token')
            .send({
              grantType: 'password',
            })
            .expect(400, {
              "message": "Missing email field."
            }, done);
        });
        it('returns 400 with password field missing', function (done) {
          request
            .post('/api/access_token')
            .send({
              grantType: 'password',
              email: 'sample@email.net'
            })
            .expect(400, {
              "message": "Missing password field."
            }, done);
        });
      });
    });
  });
  
  describe('Before running secured route tests', function () {
    it('retrives an access token', function (done) {
      request
        .post('/api/access_token')
        .send({
          grantType:'facebookToken',
          facebookToken: fbToken 
        })
        .expect(200)
        .end(function (err, res) {
          if (err) {
            console.log(res.body);
            throw err;
          }
          apiAccessToken = res.body.access_token;
          done();
        });
    });
  });

  describe('User', function () {
    describe('GET /api/users', function () {
      it('responds with 401 without an access_token', function (done) {
        request
          .get('/api/users')
          .expect(401, {
            "message": "An access token must be provided"
          }, done);
      });    
      it('responds with 500 with an invalid access_token', function (done) {
        request
          .get('/api/users')
          .query({ "access_token": 'invalidAccessToken' })
          .expect(500, {
            "message": "Invalid Token: Not enough or too many segments" 
          }, done);
      });
      it('responds with 200 with an valid access_token', function (done) {
        request
          .get('/api/users')
          .query({ "access_token": apiAccessToken })
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.body).to.have.deep
            .property('[0].facebook.id', '159184434252329');
            done();
          });
      });
  });

  });
  describe('Post', function () {

  });
  describe('Place', function () {

  });
  describe('Event', function () {

  });

  after(function (done) {
    var finished = _.after(1, function (err) {
      mongoose.connection.close();
      mongoose.models = {};
      mongoose.modelSchemas = {};
      done();
    });
    User.remove({}, function (err) {
      if (err) throw err;
      finished();
    });
  });
  
});