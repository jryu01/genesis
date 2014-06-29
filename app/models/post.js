/**
 * app/models/post.js
 * post model
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Post Schema
 */
var PostSchema = new Schema({

  activated: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    name: String,
    profilePicture: String,
    userId: Schema.Types.ObjectId
  },
  from: {
    profileType: String, //User, Event, Team etc
    profileId: Schema.Types.ObjectId, //UserId, EventPageId, TeamPageId, etc
  },
  sport: String, // type of sport
  contents: String,
  loc: {type: [Number], index: '2d'}, // [latitude, longitude]

  comments: [{
    activated: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: {
      name: String,
      profilePicture: String,
      userId: Schema.Types.ObjectId
    },
    text: String,
    score: Number,
    scorers: [Schema.Types.ObjectId], //array of User Ids
  }],
  numComments: Number,
  score: Number,
  scorers: [Schema.Types.ObjectId], //array of User Ids
}); 


/**
 * Add toJSON option to transform document before returnig the result
 */
PostSchema.options.toJSON = {
  transform: function (doc, ret, options) {

    // add id feild and remove _id and __v
    ret.id = ret._id;

    delete ret._id;
    delete ret.__v;
  }
};

module.exports = mongoose.model('Post', PostSchema);