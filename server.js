
/**
 * server.js
 */

'use strict';

// set up ==================================================
var http = require('http');
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/config');
var app = express();// express app
var server = http.createServer(app); // server
var sio = require('socket.io')(server);


// configuration ===========================================

//connect to db
mongoose.connect(config.mongo.url);

// passport config
require('./config/passport')(passport);

// express app config
require('./config/express')(app, passport);

// socket.io configuration with passportsocket.io

require('./config/sio')(sio, config, passport);

// routes ==================================================

// REST API
require('./app/routes/api')(app);

// socket 
require('./app/routes/socket')(sio);

  // start server
server.listen(app.get('port'), function () {
  console.log(config.app.name + ' server listening on port ' + 
              app.get('port') + ' for ' + config.env);
});
exports.app = app;
exports.sio = sio;