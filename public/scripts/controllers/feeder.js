/**
 * FeederController
 */
 'use strict';

 angular.module('genesisApp')
.controller('FeederController', ['$scope', '$state', 'Posts', 'socket',
function ($scope, $state, Posts, socket) {
  init();

  // when this controller destroyed remove all socket listeners
  $scope.$on('$destroy', function (event) {
    socket.removeAllListeners();
  });
  /*
   * Filter related Event handler 
   */
  $scope.$on('select filter', function (e) {
    var item = $scope.$parent.filter.selected;

    var params = { 
      limits: 10,
      commentsLimit: 0
    }; 
    if (item) {
      params.sport = item;
    }  

    $scope.postsBox.isInitialLoading = true;
    $scope.postsBox.loading = true;
    $scope.posts = null;
    Posts.list(
      { config : { params: params } },
      // Success
      function (data, status, headers, config) {
        $scope.postsBox.isInitialLoading = false;
        $scope.postsBox.loading = false;
        $scope.posts = data;
      },
      // Failure
      function (data, status, headers, config) {
        // handle this situation
      }
    );
  });

  /*
   * Post form related handlers
   */
  $scope.$on('submit post', function (e) {
    var newPost = {
      sport: $scope.$parent.postFormData.selected.value,
      // loc: [43.6525,-79.3816667], // TODO: get the location. 43,-79 for toronto
      loc: [0,0], // TODO: get the location. 43,-79 for toronto
      contents: $scope.$parent.postFormData.text
    };
    console.log(newPost);
    socket.emit('createNewPost', newPost, function (err, data) {
      if (err) {
        // handle error   
        return console.log(err);
      }
      $scope.$parent.postFormData.selected = null;
      $scope.$parent.postFormData.text = null;
      $scope.$parent.postFormData.ready = false;
      $scope.$parent.data.postFormOpened = false;

      $scope.posts.unshift(data);
    });

  });

  /*
   * post related functions
   */

  $scope.addScore = function (postId, $event) {
    // prevent propagating click event to parent div
    $event.stopPropagation();
    var $scope = this;
    var data = {
      postId: postId
    };
    socket.emit('addScore', data, function (err, data) {
      if (err) {
        return console.log(err);
      }
      if (!$scope.post.score) {
        $scope.post.score = 0;
        $scope.post.scorers = [];
      }
      // update score and socrers array of the post
      $scope.post.score +=1;
      $scope.post.scorers.push($scope.currentUser.id);
    });

  };
  $scope.removeScore = function (postId, $event) {
    // prevent propagating click event to parent div
    $event.stopPropagation();
    var $scope = this;
    var data = {
      postId: postId
    };
    socket.emit('removeScore', data, function (err, data) {
      if (err) {
        return console.log(err);
      }
      // update score and scorers array of the post
      $scope.post.score -= 1;
      var index = $scope.post.scorers.indexOf($scope.currentUser.id);
      $scope.post.scorers.splice(index,1);
    });

  };

  $scope.loadMorePosts = function () {
    $scope.postsBox.loading = true;
    var params = {
      limits: 10,
      commentsLimit: 0
    };
    if($scope.posts.length > 0) {
      params.dateBefore = $scope.posts[$scope.posts.length -1].createdAt;
    }
    if ($scope.$parent.filter.selected) {
      params.sport = $scope.$parent.filter.selected;
    }  
    Posts.list(
      { config: { params: params } },
      // Success
      function (data, status, headers, config) {
        $scope.postsBox.loading = false;
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
    // register socket events
    registerSocketEvents();

    $scope.postsBox = {
      isInitialLoading: true,
      isLoading: true
    };

    // Get posts from server
    var params = { 
      limits: 10,
      commentsLimit: 0
    };
    Posts.list(
      { config : { params: params } },
      // Success
      function (data, status, headers, config) {
        $scope.postsBox.isInitialLoading = false;
        $scope.postsBox.isLoading = false;
        $scope.posts = data;
      },
      // Failure
      function (data, status, headers, config) {
        // handle this situation
      }
    );
  }

  function registerSocketEvents() {

    socket.on('newPost', function (post) {
      var isViewing = ($scope.$parent.filter.selected === null) ||
                      $scope.$parent.filter.selected === post.sport;
      if (isViewing) {
        $scope.posts.unshift(post);
      }
    }); 

    socket.on('updateScore', function (data) {
      // update score if user have the corressponding post in their view
      for (var i = 0; i < $scope.posts.length; i++) {
        if ($scope.posts[i].id === data.postId) {
          // add score and scorer field if not already exists
          if (!$scope.posts[i].score) {
            $scope.posts[i].score = 0;
            $scope.posts[i].scorers = [];
          }
          if (data.score === 1) {
            $scope.posts[i].score +=1;
            $scope.posts[i].scorers.push(data.scorerId);
          } else if (data.score === -1) {
            var index = $scope.posts[i].scorers.indexOf(data.scorerId);
            if (index !== -1) {
              $scope.posts[i].scorers.splice(index,1);
              $scope.posts[i].score -= 1;
            }
          }
          break;
        }
      }
    });

    socket.on('newComment', function (data) {
      //add comment if user have the coreesponding post in their view
      for (var i = 0; i < $scope.posts.length; i++) {
        if ($scope.posts[i].id === data.postId) {

          // $scope.posts[i].comments.push(data.comment);

          // increment number of comments
          if(!$scope.posts[i].numComments) {
            console.log($scope.posts[i]);
            $scope.posts[i].numComments = 1;
          } else {
            $scope.posts[i].numComments += 1;
          } 

          break;
        }
      }
    });

    socket.on('error', function (data) {
      console.log(data);
    });

    socket.on('connect', function (data) {
      // TODO: enable all features that uses socket
    });

    socket.on('disconnect', function (data) {
      // TODO: disable all features that uses socket
    });
  }
}]);