/**
 * app/models/event.js
 * event model
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CommentSchema = require('./comment');

/**
 * Event Schema
 */
var EventSchema = new Schema({
  activated: { type: Boolean, default: true }, // disable when deleted
  showPublic: { type: Boolean, default: true }, // closed vs open
  createdAt: { type: Date, default: Date.now }, // auto by server
  createdBy: {
    name: String, // auto by server
    profilePicture: String,
    userId: Schema.Types.ObjectId // auto by server
  },
  name: String, // INPUT
  desc: String, // INPUT
  schedule : { // INPUT
    repeat: String,
    appDateTime : Date,
    week: {
      year: String,
      month: String,
      date: String,
      weekDay: String,
      time: String,
      eventDuration : String
    }, // find all events where its scheduledDates.startDate contains date greater than currentDate
  },
  place: { // INPUT
    placeId: Schema.Types.ObjectId,
    name: String,
    loc: {type: [Number], index: '2d'}, //address of the place
  },
  sports: String, // INPUT
  eventType: String, // INPUT
  members: [Schema.Types.ObjectId],
  
  comments: [CommentSchema],
  
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

module.exports = mongoose.model('Event', EventSchema); // access db/events