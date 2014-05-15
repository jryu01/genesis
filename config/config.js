/**
 * configuration file
 *
 */

'use strict';

var path = require('path');
var rootPath = path.normalize(__dirname + '/..');
var express = require('express');
var mongoStore = require('connect-mongo')(express);

module.exports = {
  development: {
    app: {
      name: "genesis"
    },
    root: rootPath, 
    db: "mongodb://localhost/genesis-dev",
    session: {
      key: "sid",
      secret: "thisisthefirstclasssecrets",
      store: new mongoStore({
        url: "mongodb://localhost/genesis-dev",
        collection: 'sessions'
      })
    },
    facebook: {
      clientID: "260509677458558",
      clientSecret: "de40af5c2c28469be077a5527ac37f66",
      callbackURL: "http://localhost:3000/auth/facebook/callback" 
    }
  },
  test: {
    app: {
      name: "genesis"
    },
    root: rootPath, 
    db: "mongodb://localhost/genesis-test",
    session: {
      key: "sid",
      secret: "thisisthefirstclasssecrets",
      store: new mongoStore({
        url: "mongodb://localhost/genesis-test",
        collection: 'sessions'
      })
    },
    facebook: {
      clientID: "150906278446583",
      clientSecret: "889134fea8ac45197b20d65b9edba5cc",
      callbackURL: "http://www.test.pass-on.net/auth/facebook/callback" 
    }
  },
  production: {}
};
