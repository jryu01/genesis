
/**
 * app/routes.js
 */

'use strict';

var passport = require('passport');
var auth = require('../../config/middlewares/authorization');
var authCtrl = require('../controllers/auth');
var userCtrl = require('../controllers/user');
var eventCtrl = require('../controllers/event');
var placeCtrl = require('../controllers/place');
var postCtrl = require('../controllers/post');

module.exports = function (app) {

  app.post('/api/access_token', authCtrl.issueAccessToken);

  app.get('/api/test/posts',  authCtrl.bearerAuth, auth.requiresSignin, postCtrl.list);

  // secured restful api routes
  app.all('/api/*', authCtrl.bearerAuth);
  app.get('/api/users', auth.requiresSignin, userCtrl.list);
  
  app.get('/api/events', auth.requiresSignin, eventCtrl.list);
  app.get('/api/events/:id', auth.requiresSignin, eventCtrl.get);
  app.post('/api/events', auth.requiresSignin, eventCtrl.create);
  app.post('/api/events/:id/score', auth.requiresSignin, eventCtrl.addScore);

  app.get('/api/places', auth.requiresSignin, placeCtrl.list);
  app.get('/api/places/:id', auth.requiresSignin, placeCtrl.get);
  app.post('/api/places', auth.requiresSignin, placeCtrl.create);

  app.get('/api/posts', auth.requiresSignin, postCtrl.list);
  app.get('/api/posts/:id', auth.requiresSignin, postCtrl.get);
  app.post('/api/posts', auth.requiresSignin, postCtrl.create);

  app.post('/api/posts/:id/score', auth.requiresSignin, postCtrl.addScore);
  app.delete('/api/posts/:id/score',auth.requiresSignin, postCtrl.removeScore);

  app.post('/api/events/:id/comments', auth.requiresSignin, eventCtrl.addEventComment);
  app.post('/api/places/:id/comments', auth.requiresSignin, placeCtrl.addComment);
  app.post('/api/posts/:id/comments', auth.requiresSignin, postCtrl.addComments);

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
