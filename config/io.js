
/**
 * config/io.js
 */
 
'use strict';

var express = require('express');
var passportSocketIo = require("passport.socketio");

module.exports = function (io, config, passport) {
  io.set('authorization', passportSocketIo.authorize({
    cookieParser: express.cookieParser, // use express cookieparser
    key: config.session.key, // name of the cookie key for session id
    secret: config.session.secret, // session secret
    store: config.session.store, // session store
    success: onAuthorizeSuccess, // success callback
    fail: onAuthorizeFail, // failure callback
  }));
};

function onAuthorizeSuccess(data, accept){
  console.log('successful connection to socket.io');
  // The accept-callback still allows us to decide whether to
  // accept the connection or not.
  accept(null, true);
}

function onAuthorizeFail(data, message, error, accept){
  if (error) throw new Error(message);
  console.log('failed connection to socket.io:', message);

  // We use this callback to log all of our failed connections.
  accept(null, false);
}