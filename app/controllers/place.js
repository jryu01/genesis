/*
* app/controllers/place.js
*/

'use strict';

var Place = require('../models/place');
var _ = require('lodash');

/**
 * REST API ======================================================
 */

function list(req, res) {
  listPlaces(req.query, function (err, data) {
    if (err) return res.send(500, err);
    return res.send(data);
  });
}

function get(req, res) {
  getPlaceById(req.params.id, function (err, data) {
    if (err) return res.send(500, err);  
    if (!data) return res.send(404);
    return res.send(data);
  });
}

function create(req, res) {
  var user = req.user;
  createPlace(req.body, user, function (err, data) {
    if (err) return res.send(500, err);
    return res.send(data);
  });
}

function addComment(req, res) {
  var user = req.user;
  addCommentToPlace(req.params.id, req.body, user, function (err, data) {
    if (err) return res.send(500, err);
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
      profilePicture: user.photos.profile,
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
  
  if (params.searchQuery) {    
    query.name = {
      $regex:params.searchQuery,
      $options:'i'
    };
  }

  Place.find(query, projection, options, function (err, places) {
    if (err) return callback(err, null);
    return callback(null, places);
  }); 
}

function getPlaceById(id, callback) { 
  Place.findById(id, function (err, place) {
    if (err) return callback(err, null); 
    if (!place) return callback(null, null);
    callback(null, place);
  });
}

function addCommentToPlace(placeId, data, user, callback) {
  var pid = placeId;
  var text = data.text;
  var createdBy = {
    userId: user.id,
    profilePicture: user.photos.profile,
    name: user.name.displayName
  };
  var newComment = {
    createdBy: createdBy,
    text: text
  };

  var operator = {
    $push: { comments: newComment },
    $inc: { numComments: 1 }
  };
  var options = {};

  Place.findByIdAndUpdate(pid, operator, options, function (err, place) {
    if (err) return callback(err, null);
    place = place.toJSON();
    newComment = place.comments[place.comments.length -1];
    return callback(null, newComment);
  });
}

// public functions
// REST API
exports.list = list;
exports.create = create;
exports.get = get;
exports.addComment = addComment;
// Socket API
exports.sCreateNewPlace = sCreateNewPlace;