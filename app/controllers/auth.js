
/*
* app/controllers/auth.js
*/

'use strict';

var passport = require('passport');
var User = require('../models/user');

// authentication controller functions 
var facebookAuth = passport.authenticate('facebook', { scope : 'email' });
var facebookCallback = passport.authenticate('facebook', { 
  failureRedirect : '/',
});

function facebookRedirect(req, res) {
  // update lastLogined field of the user and redirect to home
  var operator = { "$set": { "lastLogined": new Date() } };
  User.findByIdAndUpdate(req.user.id, operator, {}, function (err, user) {
    if (err) { console.log(err); }
    res.redirect('/');
  });
}

function signin(req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      req.session.message = [info.message];
      return res.send(401, info);
    }
    // if user, Log in
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.send(user.toJSON());
    });
  })(req, res, next);
}

function signup(req, res, next) {

  var email = req.body.email;
  var password = req.body.password;

  // validate email and password
  if(!email || !email.length) {
    return res.send(400, { message: 'email is not valid' });
  }
  if(!password || !password.length) {
    return res.send(400, { message: 'password is not valid' });
  }
  
  User.findOne({ 'local.email': email }, function (err, user) {
    if (err) { return next(err); }

    // check if user is already exists
    if (user) {
      return res.send(409, { message: 'the email is already taken.' });
    }

    // create and save a new user
    user = new User();
    user.local.email = email;
    user.local.password = password;

    user.save(function (err, user) {
      if (err) { return next(err); }

      // login after user is registered and saved
      req.logIn(user, function (err) {
        return res.send(user.toJSON());
      });
    });
  });
}

function signout(req, res) {
  req.logout();
  res.send(200);
}

function checkSignin(req, res) {
  res.send(req.isAuthenticated() ? req.user.toJSON() : '0');
}

// public functions and variables 
exports.signin = signin;
exports.signup = signup;
exports.signout = signout;
exports.checkSignin = checkSignin;
exports.facebookAuth = facebookAuth;
exports.facebookCallback = facebookCallback;
exports.facebookRedirect = facebookRedirect;