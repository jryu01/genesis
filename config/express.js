
/**
 * config/express.js
 */
 
'use strict';

var express = require('express');
var cons = require('consolidate');

module.exports = function (app, config, passport, mongoStore) {

  // express app configuration
  app.configure(function () {

    // set ups for view engine
    app.engine('html', cons.lodash);
    app.set('view engine', 'html');
    app.set('views', config.root + '/public/views');

    app.set('port', process.env.PORT || 3000);
    app.use(express.static(config.root + '/public'));
    app.use(express.logger('dev'));
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session(config.session));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
  });
};
