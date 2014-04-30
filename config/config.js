/**
 * configuration file
 *
 */

'use strict';

var path = require('path');
var rootPath = path.normalize(__dirname + '/..');

module.exports = {
  development: {
    root: rootPath, 
    db: "mongodb://localhost/genesis-dev",
    app: {
      name: "genesis"
    },
    facebook: {
      clientID: "260509677458558",
      clientSecret: "de40af5c2c28469be077a5527ac37f66",
      callbackURL: "http://localhost:3000/auth/facebook/callback" 
    }
  },
  test: {},
  production: {}
};
