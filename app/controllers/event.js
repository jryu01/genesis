/*
* app/controllers/event.js
*/

'use strict';

var LIMIT = 10;
var EventModel = require('../models/event');
var validator = require('validator');

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
    
    // only return after this day ...
    if (validator.isDate(req.query.dateBefore)) {
      
      var beforedates = returnEvents.filter(function(d) {
          return d - req.query.dateBefore < 0;
      }),
          afterdates = returnEvents.filter(function(d) {
          return d - req.query.dateBefore > 0;
      });
      
      //in dictionary, look for date after ***
      //query.appDateTime = { $gt: req.query.dateBefore };
      
    }
    
    console.log(req.query.dateBefore);
    console.log(beforedates);
    console.log(afterdates);
    
    /*
    // for limit of input
    eventsFromDB get next (req.query.limits || LIMIT)?
    */
    //console.log(returnEvents);
    res.send(returnEvents); // return it to front end
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