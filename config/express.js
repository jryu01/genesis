
/**
 * config/express.js
 */
 
'use strict';

var express = require('express');
var cons = require('consolidate');
var mongoStore = require('connect-mongo')(express); // mongodb session store

module.exports = function (app, config, passport) {

  // express app configuration
  app.configure(function () {

    // set ups for view engine
    app.engine('html', cons.underscore);
    app.set('view engine', 'html');
    app.set('views', config.root + '/public/views');

    app.set('port', process.env.PORT || 3000);
    app.use(express.static(config.root + '/public'));
    app.use(express.logger('dev'));
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({ 
      secret: 'thisisthefirstclasssecrets', 
      store: new mongoStore({ url: config.db, collection: 'sessions'})
    })); 
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
  });
};
