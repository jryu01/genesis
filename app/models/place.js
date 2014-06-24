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

  activated: { type: Boolean, default: true }, // disable when deleted
  verified: { type: Boolean, default: false }, // verified or not yet
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    name: String,
    userId: Schema.Types.ObjectId
  },
  name: String,
  desc: String,
  address: {
    country: String,
    city: String,
    loc: {type: [Number, Number], index: '2d'} // [latitude, longitude]
  },
  type: String, // Community Center, Outside Court, Paid Facility, School, etc
  sports: [String],

  openHour: [{
    weekday: String,
    openhour: String,
    closehour: String, 
  }],
  
  reviews: [{
    createdAt: { type: Date, default: Date.now },
    createdBy: {
      name: String,
      userId: Schema.Types.ObjectId
    },
    rating: Number,
    text: String,
  }],
  numReviews : Number,
  rating: Number,
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