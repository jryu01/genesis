/*
* app/controllers/post.js
*/

'use strict';

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

  console.log(req.body);
  console.log(req.user.id);
  //TODO: input validation

  // following is sample code
  var post = new Post({
    sport: req.body.sport,
    createdBy: {
      id: req.user.id,
      name: req.user.name.displayName
    },
    contents: req.body.contents,
    loc: req.body.loc
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