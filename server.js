
/**
 * server.js
 */

'use strict';

// set up ==================================================
var http = require('http');
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var env = process.env.NODE_ENV || 'development'; // env variable
var config = require('./config/config')[env]; // config file
var app = express();// express app
var server = http.createServer(app); // server
var io = require('socket.io').listen(server);


// configuration ===========================================

// db connection
mongoose.connect(config.db);

// passport config
require('./config/passport')(passport, config);

// express app config
require('./config/express')(app, config, passport);

// socket.io configuration with passportsocket.io

require('./config/io')(io, config, passport);

// routes ==================================================

// REST API
require('./app/routes/api')(app);

// socket 
require('./app/routes/socket')(io);
//io.sockets.on('connection', require('./app/routes/socket'));

// start server ============================================
server.listen(app.get('port'), function () {
  console.log(config.app.name + ' server listening on port ' + 
              app.get('port') + ' for ' + env);
});