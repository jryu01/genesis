/*
* app/routes/socket.js
*/

'use strict';

var postCtrl = require('../controllers/post');
var placeCtrl = require('../controllers/place');
var authCtrl = require('../controllers/auth');
var ioUtils = require('../../custom_modules/ioUtils');

module.exports = function (io) {
  io.sockets.on('connection', function (socket) {
    // socket.on('updateActivePosts', function () {} );
    
    // posts related events
    socket.on('createNewPost', postCtrl.createNewPost(socket));
    socket.on('addComment', postCtrl.addNewComment(socket));
    socket.on('addScore', postCtrl.toggleScore(socket, true));
    socket.on('removeScore', postCtrl.toggleScore(socket, false));

    // places related events
    socket.on('creatNewPlace', placeCtrl.sCreateNewPlace(socket));

    socket.on('signout', function (data) {
      var sid = socket.handshake.sessionID;

      /**
       * disconnect all current user's connections with same sessionId 
       */
      ioUtils
      .filterSocketsBySid(io, sid)
      .forEach(function (socket) {
        socket.emit('signout', { message: 'user logged out' });
        socket.disconnect();
      });
    });

  });
};