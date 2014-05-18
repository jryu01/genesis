/*
* app/controllers/event.js
*/

'use strict';

var LIMIT = 5;
var EventModel = require('../models/event');

/* list function */
function list(req, res) {

  var query = {};
  // db.events.find({"schedule.appDateTime":  {$gte:new ISODate("")}}).sort({"schedule.appDateTime" : -1}).pretty();
  
  var projection = {};
  
  var options = {
    limit: req.query.limit || LIMIT,
    sort: {
      "schedule.appDateTime": 1
    }
  };

  EventModel.find(query, projection, options, function (err, eventsFromDB) {
    if (err) return res.send(500);
    res.send(eventsFromDB); // return it to front end
  });
}

function create(req, res){
  // TODO: validation
  
  // parsing input values
  if (req.body.repeat == "onetime") var repeatVal = false;
  else var repeatVal = true;
  
  // get it as date
  var d = new Date(req.body.time);
  
  // following is sample code
  var eventInstance = new EventModel({
    activated: true,
    showPublic: true, // TODO
    name: req.body.name,
    desc: req.body.desc,
    schedule: {
      repeat: repeatVal,
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
    sport: req.body.sports,
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