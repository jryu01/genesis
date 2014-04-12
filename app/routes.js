
/**
 * app/routes.js
 */

'use strict';

var passport = require('passport');
var auth = require('../config/middlewares/authorization');
var authCtrl = require('./controllers/auth');
var userCtrl = require('./controllers/user');
var groupCtrl = require('./controllers/group');
var placeCtrl = require('./controllers/place');

module.exports = function (app) {

  // secured restful api routes
  app.get('/api/users', auth.requiresSignin, userCtrl.list);
  
  app.get('/api/groups', auth.requiresSignin, groupCtrl.list);
  app.post('/api/groups', auth.requiresSignin, groupCtrl.create);

  app.get('/api/places', auth.requiresSignin, placeCtrl.list);
  app.post('/api/places', auth.requiresSignin, placeCtrl.create);
  
  // routes for sign in,  sigin up, and signout processes

  // singnin and signup route now disabled since we are only using fb now
  // app.post('/signin', authCtrl.signin);
  // app.post('/signup', authCtrl.signup);
  app.post('/signout', authCtrl.signout);

  // check if current user is signed in 
  app.get('/signedin', authCtrl.checkSignin);

  // routes for facebook authentication
  app.get('/auth/facebook', authCtrl.facebookAuth);
  app.get('/auth/facebook/callback', authCtrl.facebookCallback, 
      authCtrl.facebookRedirect);


  // serve index.html for all other route
  app.all('/*', function (req, res) { res.render('index'); }); 
};
