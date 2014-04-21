/*
* app/controllers/post.js
*/
'use strict';

var validator = require('validator');
var Post = require('../models/post');

function list(req, res) {
  Post.find(req.query, function (err, posts) {
    if (err) return res.send(500);
    res.send(posts);
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
  // substitute some <br> for the paragraph breaks
  contents = contents.replace(/\r?\n/g, '<br>');

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
  
// }

// function remove(req, res){
  
// }

// public functions
exports.list = list;
exports.create = create;