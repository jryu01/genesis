/**
 * FeederController
 */
 'use strict';

 angular.module('genesisApp')
.controller('FeederController', ['$scope', '$state', 'Posts', 'socket',
function ($scope, $state, Posts, socket) {

  init();

  // Submit post form
  $scope.submitPost = function () {
    if (!$scope.postText) {
      return;
    }
    var newPost = {
      sport: "NYI", // TODO: select sport
      loc: [0,0],  // TODO: get location of current user
      contents: $scope.postText
    };
    // Posts.create({data: newPost}, 
    //   function (data, status, headers, config) {
    //     $scope.postText = null;
    //     $scope.posts.unshift(data);
    //   },
    //   // Failure
    //   function (data, status, headers, config) {

    //   });
    socket.emit('newPost', newPost, function (err, data) {
      if (err) {
        // handle error   
      }
      console.log(data);
      $scope.postText = null; 
      $scope.posts.unshift(data);
    });
  };
  // add comment to the post with postId
  $scope.addComment = function (postId) {
    var $scope = this;
    if (!$scope.commentText) {
      return;
    }
    var options = {
      postId: postId,
      data: {
        text: $scope.commentText
      }
    };
    Posts.addComment(
      options,
      // Success
      function (data, status, headers, config) {
        $scope.commentText = null;
        // $scope.post.comments.push(data);
        $scope.post.comments = data;
        // increment number of comments
        if(!$scope.post.numComments) {
          $scope.post.numComments = 1;
        } else {
          $scope.post.numComments += 1;
        }
        $scope.commentsExpand = true;
      },
      // Failure
      function (data, status, headers, config) {

      }
    );
  };
  $scope.hideComments = function () {
    var $scope = this;
    var comments = $scope.post.comments;
    $scope.post.comments = [comments[comments.length -1]];
    $scope.commentsExpand = false;
  };
  $scope.loadComments = function (postId) {
    var $scope = this;
    var options = {
      postId: postId,
    };
    Posts.get(
      options,
      // Success
      function (data, status, headers, config) {
        if (data.comments.length > 1) {
          $scope.post.comments = data.comments;
          $scope.post.numComments = data.numComments;
          $scope.commentsExpand = true;
        }
      },
      // Failure
      function (data, status, headers, config) {

      }
    );
  };
  $scope.addScore = function (postId) {
    var $scope = this;
    var options = {
      postId: postId
    };
    Posts.addScore(
      options,
      // Success
      function (data, status, headers, config) {
        if (!$scope.post.score) {
          $scope.post.score = 0;
          $scope.post.scorers = [];
        }
        // update score and scorers array of the post
        $scope.post.score +=1;
        $scope.post.scorers.push($scope.currentUser.id);
      },
      // Failure
      function (data, status, headers, config) {

      }
    );
  };
  $scope.removeScore = function (postId) {
    var $scope = this;
    var options = {
      postId: postId
    };
    Posts.removeScore(
      options,
      // Success
      function (data, status, headers, config) {
        // update score and scorers array of the post
        $scope.post.score -=1;
        var index = $scope.post.scorers.indexOf($scope.currentUser.id);
        $scope.post.scorers.splice(index,1);
      },
      // Failure
      function (data, status, headers, config) {

      }
    );
  };
  $scope.loadMorePosts = function () {
    $scope.loading = true;
    var params = {
      limit: 5,
      commentsLimit: 1,
      dateBefore: $scope.posts[$scope.posts.length -1].createdAt
    };
    Posts.list(
      { config: { params: params } },
      // Success
      function (data, status, headers, config) {
        $scope.loading = false;
        $scope.posts = $scope.posts.concat(data);
      },
      // Failure
      function (data, status, headers, config) {
        // handle this situation
      }
    );
  };
  // initializing with data load when page start
  function init() {

    // when this controller destroyed remove all socket listeners
    $scope.$on('$destroy', function (event) {
      socket.removeAllListeners();
    });

    // register socket events
    registerSocketEvents();

    // Get posts from server
    $scope.loading = true;
    var params = { 
      limit: 5,
      commentsLimit: 1
    };
    Posts.list(
      { config : { params: params } },
      // Success
      function (data, status, headers, config) {
        $scope.loading = false;
        $scope.posts = data;
      },
      // Failure
      function (data, status, headers, config) {
        // handle this situation
      }
    );
  }
  function registerSocketEvents() {

    socket.on('newPost', function (data) {
      $scope.postText = null; 
      $scope.posts.unshift(data);
    }); 

    socket.on('error', function (data) {
      console.log(data);
    });

    socket.on('connect', function (data) {
      // TODO: enable all socket that uses socket
    });
    
    socket.on('disconnect', function (data) {
      // TODO: disable all feature that uses socket
    });

  }
}]);