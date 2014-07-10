/*
* app/controllers/event.js
*/

'use strict';

var LIMIT = 10;
var EventModel = require('../models/event');
var Place = require('../models/place');
var validator = require('validator');

function addEventComment(req, res) {
  
  var eventId = req.body.id;
  var text = req.body.text;
  
  var createdBy = {
    userId: req.user.id,
    profilePicture: req.user.photos.profile,
    name: req.user.name.displayName
  };
  
  // sanitize
  text = validator.escape(text);
  
  var newComment = {
    createdBy: createdBy,
    text: text
  };
  
  var operator = {
    $push: { comments: newComment },
  };
  
  var options = {};

  EventModel.findByIdAndUpdate(eventId, operator, options, function(err, event) {
    if (err) { return res.send(500); }
    event = event.toJSON();
    res.send(event.comments);
  });
  
}

/* list function */
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
  
  var projection = {};
  
  var options = {
    sort: {
      "schedule.appDateTime": 1
      //createdAt: -1
    }
  };
  
  EventModel.find(query, projection, options, function (err, eventsFromDB) {
    if (err) return res.send(500); // if error
    
    // return events
    var returnEvents = [];
    var todayDate = new Date();
    todayDate.setHours(0,0,0,0);
    var localLimit = 10;

    for (var key in eventsFromDB) {
      /// ADD repeat events
      if (eventsFromDB[key].schedule.appDateTime < todayDate) // if date is yesterday or older
      {
        if (eventsFromDB[key].schedule.repeat != "once") // and if it is repeat
        {
          // if daily, set date to today and add to the list based on datetime
          if (eventsFromDB[key].schedule.repeat == "daily")
          {
            eventsFromDB[key].schedule.appDateTime.setMonth(todayDate.getMonth());
            eventsFromDB[key].schedule.appDateTime.setDate(todayDate.getDate());
            returnEvents.push(eventsFromDB[key]);
          }
          
          // if weekly, get the weekday, and get next week day, add to that day based on time
          if (eventsFromDB[key].schedule.repeat == "weekly")
          {
            // calc weekday of key..
            var tempDay = eventsFromDB[key].schedule.appDateTime.getDay();
            var todayDay = todayDate.getDay();
            
            // calc next weekday of this key...
            if (tempDay < todayDay) tempDay = tempDay + 7;
            var addedDay = tempDay - todayDay;
            
            // change date of the key
            eventsFromDB[key].schedule.appDateTime.setDate(todayDate.getDate() + addedDay); 
            returnEvents.push(eventsFromDB[key]);
          }
          
          // if monthly, get days, and get next day, add to that day
          if (eventsFromDB[key].schedule.repeat == "monthly")
          {
            var originDate = eventsFromDB[key].schedule.appDateTime.getDate();
            
            for (var i = 0; i <= 3; i++) {
              
                eventsFromDB[key].schedule.appDateTime.setDate(originDate - i);
              
                // calc day of key..
                if (eventsFromDB[key].schedule.appDateTime.getDate() < todayDate.getDate())
                {
                  eventsFromDB[key].schedule.appDateTime.setMonth(todayDate.getMonth() + 1);
                }
                else
                {
                  eventsFromDB[key].schedule.appDateTime.setMonth(todayDate.getMonth());
                }
              
                if (eventsFromDB[key].schedule.appDateTime.getDate() == (originDate - i)) break;
              }
              // change the day
              returnEvents.push(eventsFromDB[key]);
          }
        }
      }
      else
      {
        /// ADD normal valid dates
        //add to return events
        returnEvents.push(eventsFromDB[key]);
      }   
    }
  
    //// sort
    returnEvents.sort(function(a,b){
      return new Date(new Date(a.schedule.appDateTime - b.schedule.appDateTime));
    });
    
    // fix bug
    var cutter = returnEvents.length;
    
    // only return after this day ...
    if (validator.isDate(req.query.dateBefore)) {
      for (var key in returnEvents) {
        if (returnEvents[key].schedule.appDateTime > new Date(req.query.dateBefore)) 
        { 
          cutter = parseInt(key);
          break;
        }
      }
      returnEvents = returnEvents.slice(cutter, returnEvents.length);
    }
    
    // for limit of input
    if (returnEvents.length > localLimit)
    {
      returnEvents = returnEvents.slice(1, parseInt(localLimit) + parseInt(1));
    }
    
    res.send(returnEvents); // return it to front end
  });
}

////////
/* create function */
////////
function create(req, res){
 
  // get it as date
  var d = new Date(req.body.time);

  // get the place if possible
  
    
  // Place link if possible
  var query = {name : req.body.place }, 
      projection = {}, 
      options = {};
  
  Place.findOne(query, projection, options, function (err, place) {
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
        userId: req.user.id,
        profilePicture: req.user.photos.profile,
        name: req.user.name.displayName
      },
      place: {
        name: req.body.place
      },
      sports: req.body.sports,
      eventType: req.body.types,
      members: [req.user.id]
    });
    if (place) {
      eventInstance.place.placeId = place.id;
      eventInstance.place.loc = place.loc;
    }

    eventInstance.save(function (err, eventsFromDB) {
      if (err) { return res.send(500, err); }
      res.send(eventsFromDB); // return it to front end
    });
  }); 
}

function get(req, res){
  EventModel.findById(req.params.id, function (err, event) {
    if (err) { return res.send(500, err); }
    if (!event) {
      return res.send(404);
    }
    // send back
    res.send(event);
  });
}

// function remove(req, res){
  
// }

// public functions
exports.list = list;
exports.create = create;
exports.get = get;
exports.addEventComment = addEventComment;