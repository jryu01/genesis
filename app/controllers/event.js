/*
* app/controllers/event.js
*/

'use strict';

var LIMIT = 1;
var EventModel = require('../models/event');

////////
/* list function */
////////
function list(req, res) {

  var query = {};
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
    limit: req.query.limit || LIMIT,
    sort: {
      "schedule.appDateTime": 1
    }
  };
  
  console.log(options.limit);

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
      week: {
        year: d.getFullYear(),
        month: d.getMonth(),
        date: d.getDate(),
        weekDay: d.getDay(),
        time: d.getHours() + ":" + d.getMinutes(),
        eventDuration : "",
      },
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