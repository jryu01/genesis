/**
 * custom_modules/ioUtils.js
 */

 'use strict';

 // Helper functions for socket.io

function filterSocketsByUser(socketIo, filter){
  var handshaken = socketIo.sockets.manager.handshaken;
  return Object.keys(handshaken || {})
    .filter(function(skey){
      return filter(handshaken[skey].user);
    })
    .map(function(skey){
      return socketIo.sockets.manager.sockets.sockets[skey];
    });
}

function filterSocketsBySid(socketIo, sid) {

  // Object containing handshaken socket objects 
  var handshaken = socketIo.sockets.manager.handshaken; 
  // Array of socketid keys
  var socketKeys = Object.keys(handshaken || {});

  // filter socketKeys and map to socket object and return the result
  return socketKeys.filter(function (socketKey) {
    return handshaken[socketKey].sessionID === sid; 
  }).map(function (socketKey) {
    return socketIo.sockets.sockets[socketKey];
  });
}
exports.filterSocketsByUser = filterSocketsByUser; 
exports.filterSocketsBySid = filterSocketsBySid; 