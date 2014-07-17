/**
 * app/models/pcommentSchema.js
 * Comment Schema
 * This schema is used as subdocument of parent docs(post, event, place)
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
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
});

/**
 * Add toJSON option to transform document before returnig the result
 */
CommentSchema.options.toJSON = {
  transform: function (doc, ret, options) {

    // add id feild and remove _id and __v
    ret.id = ret._id;

    delete ret._id;
    delete ret.__v;
  }
};

module.exports = CommentSchema;