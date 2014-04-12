/*
* app/controllers/group.js
*/

'use strict';

var Group = require('../models/group');
function list(req, res) {
  Group.find(req.query, function (err, groups) {
    if (err) return res.send(500);
    res.send(groups);
  }); 
}

// function get(req, res){:w

// }

function create(req, res){
  // validation

  //TODO: name, desc, place, city, and sports must be provided and validated

  var group = new Group({
    name: req.body.name,
    desc: req.body.desc,
    createdBy: {
      userId: req.user.id,
      name: req.user.name.displayName
    },
    place: req.body.place,
    city: req.body.city,
    sport: req.body.sport,
    members: [req.user.id]
  });

  group.save(function (err, group) {
    if (err) { return res.send(500); }
    res.send(group);
  });
}

// function update(req, res){
  
// }

// function remove(req, res){
  
// }

// public functions
exports.list = list;
exports.create = create;