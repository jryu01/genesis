/**
 * app/models/group.js
 * group model
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Group Schema
 */
var GroupSchema = new Schema({

  name: String,
  desc: String,
  createdBy: { userId: Schema.Types.ObjectId, name: String },
  dateCreated: { type: Date, default: Date.now },
  place: { type: Schema.Types.ObjectId, ref: 'Place' },
  city: String,
  sport: String,
  members: [Schema.Types.ObjectId]

}); 

/**
 * Add toJSON option to transform document before returnig the result
 */
GroupSchema.options.toJSON = {
  transform: function (doc, ret, options) {

    // add id feild and remove _id and __v
    ret.id = ret._id;

    delete ret._id;
    delete ret.__v;
  }
};

module.exports = mongoose.model('Group', GroupSchema);