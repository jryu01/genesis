/*
* app/controllers/post.js
*/
'use strict';

var validator = require('validator');
var Post = require('../models/post');
var LIMIT = 5;

function list(req, res) {

  var query = {};

  if (validator.isDate(req.query.dateBefore)) {
    query.createdAt = { $lt: req.query.dateBefore };
  }
  var projection = { comments: { $slice: -1 * req.query.commentsLimit } };

  var options = {
    limit: req.query.limit || LIMIT,
    sort: {
      createdAt: -1
    }
  };

  Post.find(query, projection, options, function (err, posts) {
    if (err) return res.send(500);
    res.send(posts);
  }); 
}

function get(req, res) {
  Post.findById(req.params.id, function (err, post) {
    if (err) { return res.send(500); }
    res.send(post);
  });
}

// function get(req, res){:w

// }

function create(req, res){

  var sport = req.body.sport;
  var contents = req.body.contents;
  var loc = req.body.loc;
  var createdBy = {
    id: req.body.id,
    name: req.user.name.displayName
  };

  // Validate Inputs
  var message = "";
  if (!sport || !contents || !loc) {
    message = "values for sport, contents, and loc must be provided.";
    return res.send(400, { message: message });
  }
  if (Object.prototype.toString.call(loc) !== '[object Array]' || 
      loc.length !== 2 ||
      !(validator.isNumeric(loc[0]) && validator.isNumeric(loc[1]))) {
    message = "loc must be a form of Number Array with length 2.";
    return res.send(400, { message: message });
  }

  // Sanitize inputs
  contents = validator.escape(contents);

  // Create a new post
  var post = new Post({
    sport: sport,
    createdBy: createdBy,
    contents: contents,
    loc: loc
  });

  post.save(function (err, post) {
    if (err) { return res.send(500); }
    res.send(post);
  });
}

// function update(req, res){

  // var operator = {};
  // var options = {};

  // Post.findByIdAndUpdate(req.params.id, operator, options);
  // console.log(req.params.id);
  // console.log(req.body.comment);
  // res.send("DONE"); 
// }

// function remove(req, res){
  
// }

function addComments(req, res) {
  var postId = req.params.id;
  var text = req.body.text;
  var createdBy = {
    id: req.body.id,
    name: req.user.name.displayName
  };
  if (!text) {
    var message = "string value for text must be provided.";
    return res.send(400, { message: message });
  }
  // sanitize
  text = validator.escape(text);
  var newComment = {
    createdBy: createdBy,
    text: text
  };
  var operator = {
    $push: { comments: newComment },
    $inc: { numComments: 1 }
  };
  var options = {};

  Post.findByIdAndUpdate(postId, operator, options, function(err, post) {
    if (err) { return res.send(500); }
    post = post.toJSON();
    res.send(post.comments);
  });
}

// public functions
exports.list = list;
exports.get = get;
exports.create = create;
exports.addComments = addComments;