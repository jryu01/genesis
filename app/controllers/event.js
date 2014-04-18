/*
* app/controllers/event.js
*/

'use strict';

var Event = require('../models/event');
function list(req, res) {
  Event.find(req.query, function (err, groups) {
    if (err) return res.send(500);
    res.send(groups);
  }); 
}

// function get(req, res){:w

// }

function create(req, res){
  // validation

  //TODO: name, desc, place, city, and sports must be provided and validated

  // following is sample code
  var event = new Event({
    name: req.body.name,
    desc: req.body.desc,
    createdBy: {
      id: req.user.id,
      name: req.user.name.displayName
    },
    place: req.body.place,
    city: req.body.city,
    sport: req.body.sport,
    members: [req.user.id]
  });

  event.save(function (err, Event) {
    if (err) { return res.send(500); }
    res.send(Event);
  });
}

// function update(req, res){
  
// }

// function remove(req, res){
  
// }

// public functions
exports.list = list;
exports.create = create;