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
  verified: { type: Boolean, default: false }, // verified or not
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    name: { type: String, required: true },
    profilePicture: { type: String },
    userId: { type: Schema.Types.ObjectId, required: true }
  },

  /**
   * From User Input
   */
  // mandatory input
  name: { type: String, required: true },
  address: {  
    street: { type: String, required: false },
    city: { type: String, required: true },
    province: { type: String, required: true },
    country: { type: String, required: true },
  },
  loc: {
    type: [Number, Number], // [latitude, longitude]
    index: '2d',
    required: true
  },
  
  // optional input
  description: String,
  phone: String,
  type: String, //Community Center, Outside Court, Paid Facility, School, etc
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
      name: { type: String, required: true },
      profilePicture: { type: String },
      userId: { type: Schema.Types.ObjectId, required: true }
    },
    text: { type: String, required: true }
  }],
  numComments: Number,
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

/**
 * Validators
 */
function isTest(val) {
  return val === "test";
}

module.exports = mongoose.model('Place', PlaceSchema);