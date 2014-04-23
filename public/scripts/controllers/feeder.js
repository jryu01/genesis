/**
 * FeederController
 */
 'use strict';

 angular.module('genesisApp')
.controller('FeederController', ['$scope', '$state', 'Posts', 
function ($scope, $state, Posts) {

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
    Posts.create({data: newPost}, 
      function (data, status, headers, config) {
        $scope.postText = null;
        $scope.posts.unshift(data);
      },
      // Failure
      function (data, status, headers, config) {

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
}]);