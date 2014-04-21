
/**
 * app/routes.js
 */

'use strict';

var passport = require('passport');
var auth = require('../config/middlewares/authorization');
var authCtrl = require('./controllers/auth');
var userCtrl = require('./controllers/user');
var eventCtrl = require('./controllers/event');
var placeCtrl = require('./controllers/place');
var postCtrl = require('./controllers/post');

module.exports = function (app) {

  // secured restful api routes
  app.get('/api/users', auth.requiresSignin, userCtrl.list);
  
  app.get('/api/events', auth.requiresSignin, eventCtrl.list);
  app.post('/api/events', auth.requiresSignin, eventCtrl.create);

  app.get('/api/places', auth.requiresSignin, placeCtrl.list);
  app.post('/api/places', auth.requiresSignin, placeCtrl.create);

  app.get('/api/posts', auth.requiresSignin, postCtrl.list);
  app.post('/api/posts', auth.requiresSignin, postCtrl.create);

  // app.get('/api/posts', auth.requiresSignin, postCtrl.list);
  // app.post('/api/posts', auth.requiresSignin, postCtrl.create);
  
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
