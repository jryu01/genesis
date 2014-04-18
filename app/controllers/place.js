/*
* app/controllers/place.js
*/

'use strict';

var Place = require('../models/place');
function list(req, res) {
  Place.find(req.query, function (err, places) {
    if (err) return res.send(500);
    res.send(places);
  }); 
}

// function get(req, res){:w

// }

function create(req, res){
  // validation

  //TODO: all mandatory fields must be provided and validated

  // following is a sample code
  var place = new Place({
    createdBy: {
      id: req.user.id,
      name: req.user.name.displayName
    },
    name: req.body.name,
    desc: req.body.desc,
    address: req.body.address,
    type: req.body.type,
    openHour: req.body.openHour,
    sports: req.body.sports
  });
  place.save(function (err, place) {
    if (err) { return res.send(500); }
    res.send(place);
  });
}

// function update(req, res){
  
// }

// function remove(req, res){
  
// }

// public functions
exports.list = list;
exports.create = create;