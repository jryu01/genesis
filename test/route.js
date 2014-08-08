
'use strict';

var mongoose = require('mongoose');
    mongoose.connection.close();
    mongoose.models = {};
    mongoose.modelSchemas = {};
var request = require('supertest');
var should = require("chai").should();
var config = require('../config/config');
var User = require('../app/models/user');
var app = require('../server.js').app;

describe('API Route', function () {

  request = request(app);

  var fbToken = 'CAADs7qLJFH4BAHbniAdtdGT3jH3zhZBhYrw85IOxXTSdCGxVnsrgnLyZBnBePELTEEomRtYNOHMOczCB08qiTZAGNc5JMZCzjkfZCVCN8PDTaVu2afJSioHBZBJG5gYiQKZCWAYQondvrhi3ZC963n7LOtNfXJ2wbv4rZCWjrZA626xIFcmcCHl96msw26AyBA2oZAXS6GeaaNLSN5FfTBuFqwX02ZB7CPOJXysZD';
  var invalidFbToken = 'CAADs7qLJFH4BAHbniAdtdGT3jH3zhZBhYrw85IOxXTSdCGxVnsrgnLyZBnBePELTEEomRtYNOHMOczCB08qiTZAGNc5JMZCzjkfZCVCN8PDTaVu2afJSioHBZBJG5gYiQKZCWAYQondvrhi3ZC963n7LOtNfXJ2wbv4rZCWjrZA626xIFcmcCHl96msw26AyBA2oZAXS6GeaaNLSN5FfTBuFqwX02ZB7CPOJXysZa';
  var apiAccessToken = '';

  before(function (done) {
    request
      .post('/api/access_token')
      .send({
        grantType:'facebook_token',
        token: fbToken 
      })
      .expect(200)
      .end(function (err, res) {
        if (err) {
          throw err;
        }
        apiAccessToken = res.body.access_token;
        done();
      });
  });

  describe('Auth', function () {
    describe('POST /api/access_token', function () {
      it('should issue and retreive an access token', function (done) {
        request
          .post('/api/access_token')
          .send({
            grantType:'facebook_token',
            token: fbToken 
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            res.body.should.have.property('access_token').to.be.not.empty;
            res.body.should.have.property('user').to.be.an('object');
            done();
          });
      });
      it('should return 400 with no grantType field', function (done) {
        request
          .post('/api/access_token')
          .send({
            token: fbToken
          })
          .expect(400, done);
      });
      it('should return 400 with invalid grantType field', function (done) {
        request
          .post('/api/access_token')
          .send({
            grantType: 'invalidType',
            token: fbToken
          })
          .expect(400, done);
      });
      it('should return 400 with token field missing', function (done) {
        request
          .post('/api/access_token')
          .send({
            grantType: 'facebook_token',
          })
          .expect(400, done);
      });
      it('should return 400 with invalid facebook token', function (done) {
        request
          .post('/api/access_token')
          .send({
            grantType: 'facebook_token',
            token: invalidFbToken
          })
          .expect(400, done);
      });
    });
  });

  describe('User', function () {
    describe('GET /api/users', function () {
      it('should respond with 401 without an access_token', function (done) {
        request
          .get('/api/users')
          .expect(401, done);
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
    done();
  });
});