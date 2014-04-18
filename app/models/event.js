/**
 * app/models/event.js
 * event model
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Event Schema
 */
var EventSchema = new Schema({

  activated: { type: Boolean, default: true },
  showPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    name: String,
    id: Schema.Types.ObjectId
  },
  name: String,
  desc: String,
  schedule : {
    repeat: { type: Boolean, default: false },
    week: [{
      weekDay: String,
      startTime: String, //or Number 
      endTime: String,
    }],
    // for one time or menaully setted dates (repeat set to false)
    dates: [{
      startDate: Date,
      endDate: Date,
    }], // find all events where its scheduledDates.startDate contains date greater than currentDate
  },
  place: {
    id: Schema.Types.ObjectId,
    name: String,
    loc: {type: [Number], index: '2d'}, //address of the place
  },
  sport: String,
  members: [Schema.Types.ObjectId],
  city: String,

}); 

/**
 * Add toJSON option to transform document before returnig the result
 */
EventSchema.options.toJSON = {
  transform: function (doc, ret, options) {

    // add id feild and remove _id and __v
    ret.id = ret._id;

    delete ret._id;
    delete ret.__v;
  }
};

module.exports = mongoose.model('Event', EventSchema);