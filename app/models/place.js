/**
 * app/models/place.js
 * place model
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var PostSchema = mongoose.model('Post', PostSchema);

/**
 * Place Schema
 */
var PlaceSchema = new Schema({


  createdAt: { type: Date, default: Date.now },
  createdBy: {
    name: String,
    id: Schema.Types.ObjectId
  },
  name: String,
  desc: String,
  address: {
    country: String,
    city: String,
    loc: {type: [Number], index: '2d'} // [longitude, latitude]
  },
  type: String, // Community Center, Outside Court, Paid Facility, School, etc
  sports: [String],

  openHour: [{
    weekday: String,
    openhour: String,
    closehour: String, 
  }],
  comments: [{
    activated: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: {
      name: String,
      id: Schema.Types.ObjectId
    },
    text: String,
    score: Number,
  }],
}); 

/**
 * Add toJSON option to transform document before returnig the result
 */
PlaceSchema.options.toJSON = {
  transform: function (doc, ret, options) {

    // add id feild and remove _id and __v
    ret.id = ret._id;

    delete ret._id;
    delete ret.__v;
  }
};

module.exports = mongoose.model('Place', PlaceSchema);