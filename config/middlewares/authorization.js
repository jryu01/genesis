/**
 * middleware for securing routes
 *
 */

'use strict';

// generic require signin middleware
exports.requiresSignin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.send(401, { message: "requires an authentication" });
  }
  next();
};
