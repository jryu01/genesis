/*
* app/controllers/event.js
*/

'use strict';

var LIMIT = 10;
var EventModel = require('../models/event');
var validator = require('validator');

////////
/* list function */
////////
function list(req, res) {

  var query = {};
  if (validator.isDate(req.query.dateBefore)) {
    query.appDateTime = { $gt: req.query.dateBefore };
  }
  // if eventtypes query exsists
  if (req.query.eventType) {
    query.eventType = req.query.eventType;
  }
  // if sporttype query exsists
  if (req.query.sports) {
    query.sports = req.query.sports;
  }
  // db.events.find({"schedule.appDateTime":  {$gte:new ISODate("")}}).sort({"schedule.appDateTime" : -1}).pretty();
  
  var projection = {};
  
  var options = {
    limit: req.query.limits || LIMIT,
    sort: {
      "schedule.appDateTime": 1
      //createdAt: -1
    }
  };
  
  EventModel.find(query, projection, options, function (err, eventsFromDB) {
    if (err) return res.send(500);
    res.send(eventsFromDB); // return it to front end
  });
}

////////
/* create function */
////////
function create(req, res){
  // TODO: Basic validation against remote update
  
  // get it as date
  var d = new Date(req.body.time);
  
  // following is sample code
  var eventInstance = new EventModel({
    activated: true,
    showPublic: true, // TODO
    name: req.body.name,
    desc: req.body.desc,
    schedule: {
      repeat: req.body.repeat,
      appDateTime: d,
    },
    createdBy: {
      id: req.user.id,
      name: req.user.name.displayName
    },
    place: {
      name: req.body.place // TODO
    },
    sports: req.body.sports,
    eventType: req.body.types,
    members: [req.user.id]
  });

  eventInstance.save(function (err, eventsFromDB) {
    if (err) { return res.send(500); }
    res.send(eventsFromDB); // return it to front end
  });
}

// function update(req, res){
  
// }

// function remove(req, res){
  
// }

// public functions
exports.list = list;
exports.create = create;