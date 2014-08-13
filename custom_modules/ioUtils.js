/**
 * custom_modules/ioUtils.js
 */

 'use strict';

 // Helper functions for socket.io

function filterSocketsByUser(socketIo, filter){
  var connected = socketIo.sockets.connected; 
  return Object.keys(connected || {})
    .filter(function(skey){
      return filter(connected[skey].request.user);
    })
    .map(function(skey){
      return connected[skey];
    });
}

function filterSocketsBySid(socketIo, sid) {
  // Object containing handshaken socket objects 
  var connected = socketIo.sockets.connected; 
  // Array of socketid keys
  var socketKeys = Object.keys(connected || {});

  // filter socketKeys and map to socket object and return the result
  return socketKeys.filter(function (socketKey) {
    return connected[socketKey].request.sessionID === sid; 
  }).map(function (socketKey) {
    return connected[socketKey];
  });
}
exports.filterSocketsByUser = filterSocketsByUser; 
exports.filterSocketsBySid = filterSocketsBySid; 