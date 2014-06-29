/*
* app/controllers/place.js
*/

'use strict';

var Place = require('../models/place');
var _ = require('underscore');

/**
 * REST API ======================================================
 */

function list(req, res) {
  listPlaces(req.query, function (err, data) {
    if (err) return res.send(err);
    return res.send(data);
  });
}

// function get(req, res){:w

// }

function create(req, res){
  var user = req.user;
  createPlace(req.body, user, function (err, data) {
    if (err) return res.send(err);
    return res.send(data);
  });
}

// function update(req, res){
  
// }

// function remove(req, res){
  
// }

/**
 * Socket API ======================================================
 */
function sCreateNewPlace(socket) {
  return function (data, callback) {
    var user = socket.handshake.user;
    createPlace(data, user, callback);
  };
}


/**
 * Helpers ==========================================================
 */
function createPlace(data, user, callback) {

  // restrict to recive following fields only from client
  var allowedKeys = [
    'name',
    'address',
    'loc',
    'description',
    'phone',
    'type',
    'sports',
    'openHour'
  ];

  // pick only whitelisted properties of the data
  data = _.pick(data, allowedKeys);

  // create a new Place
  var place = new Place({
    createdBy: {
      userId: user.id,
      name: user.name.displayName
    }
  });
  _.extend(place, data);

  // save the place to the db
  place.save(function (err, place) {
    if (err) return callback(err, null);
    return callback(null, place);
  });
}

function listPlaces(params, callback) {
  var query = {}, 
      projection = {}, 
      options = {};

  query.verified = false; // in production change it to true

  if (params.center) {
    query.loc = {
      $geoWithin: {
        $center : [params.center, params.radius || 1]
      } 
    };
  }

  Place.find(query, projection, options, function (err, places) {
    if (err) return callback(err, null);
    return callback(null, places);
  }); 
}

// public functions
// REST API
exports.list = list;
exports.create = create;
// Socket API
exports.sCreateNewPlace = sCreateNewPlace;