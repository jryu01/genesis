
/**
 * config/io.js
 */
 
'use strict';

var express = require('express');
var User = require('../app/models/user');

module.exports = function (sio, config, passport) {
  sio.use(function(socket, next) {

    var sessionStore = config.session.store;
    var cookie = parseCookie(express.cookieParser(config.session.secret),
                  socket.request.headers.cookie || '');
    socket.request.sessionID = cookie[config.session.key] || '';

    // get session and retrive user id
    sessionStore.get(socket.request.sessionID, function (err, session) {
      if (err) { 
        return next(new Error('Error in session store: ' + err.message)); 
      }
      if (!session) {
        return next(new Error('No session found')); 
      }
      if (!session.passport || !session.passport.user) {
        return next(new Error('Passport not initialized or user not found')); 
      }
      var userId = session.passport.user;
      User.findById(userId, function (err, user) {
        if (err) { return next(err); }
        if (!user) { return next(new Error('not authorized')); }
        socket.request.user = user;
        next();
      });
    }); 
  });
};

function parseCookie(cookieParser, cookieHeader) {
  var req = {
    headers:{
      cookie: cookieHeader
    }
  };
  var result;
  cookieParser(req, {}, function (err) {
    if (err) throw err;
    result = req.signedCookies || req.cookies;
  });
  return result;
}