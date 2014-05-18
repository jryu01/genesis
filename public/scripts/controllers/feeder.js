/**
 * FeederController
 */
 'use strict';

 angular.module('genesisApp')
.controller('FeederController', ['$scope', '$state', 'Posts', 'socket',
function ($scope, $state, Posts, socket) {

  /*
   * Filter related Event handler 
   */
  $scope.$on('select filter', function (e) {
    var item = $scope.$parent.filter.selected;
    console.log(item);

    // set postform sport to selected item
    $scope.selectDropdown((item === 'All') ? null : item);

    var params = { 
      limit: 5,
      commentsLimit: 1
    }; 
    if (item !== 'All') {
      params.sport = item;
    }  
    $scope.postsBox.loading = true;
    Posts.list(
      { config : { params: params } },
      // Success
      function (data, status, headers, config) {
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
   * Post form related functions
   */

  // select dropdown
  $scope.selectDropdown = function (select) {
    $scope.postForm.type = select;
  };
  // Submit post form
  $scope.submitPost = function () {
    if (!$scope.postForm.postText) {
      return;
    }
    if (!$scope.postForm.type) {

      // TODO: popup to inform user to select sport

      return;
    }
    var newPost = {
      sport: $scope.postForm.type, // TODO: select sport
      loc: [43.6525,-79.3816667], // TODO: get the location. 43,-79 for toronto
      contents: $scope.postForm.postText
    };
    // Posts.create({data: newPost}, 
    //   function (data, status, headers, config) {
    //     $scope.postForm = {};
    //     $scope.posts.unshift(data);
    //   },
    //   // Failure
    //   function (data, status, headers, config) {

    //   });
    socket.emit('createNewPost', newPost, function (err, data) {
      if (err) {
        // handle error   
        return console.log(err);
      }
      $scope.postForm = {}; 
      $scope.posts.unshift(data);
    });
  };

  /*
   * post related functions
   */

  // add comment to the post with postId
  $scope.addComment = function (postId) {
    var $scope = this;
    if (!$scope.commentText) {
      return;
    }
    var data = {
      postId: postId,
      comment: {
        text: $scope.commentText
      }
    };
    socket.emit('addComment', data, function (err, newComment) {
      if (err) {
        return console.log(err);
      }
      $scope.commentText = null;
      $scope.post.comments.push(newComment);

      // increment number of comments
      if(!$scope.post.numComments) {
        $scope.post.numComments = 1;
      } else {
        $scope.post.numComments += 1;
      }
    });
    // var options = {
    //   postId: postId,
    //   data: {
    //     text: $scope.commentText
    //   }
    // };
    // Posts.addComment(
    //   options,
    //   // Success
      // function (data, status, headers, config) {
      //   $scope.commentText = null;
      //   // $scope.post.comments.push(data);
      //   $scope.post.comments = data;
      //   // increment number of comments
      //   if(!$scope.post.numComments) {
      //     $scope.post.numComments = 1;
      //   } else {
      //     $scope.post.numComments += 1;
      //   }
      //   $scope.commentsExpand = true;
      // },
    //   // Failure
    //   function (data, status, headers, config) {

    //   }
    // );
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

    // var options = {
    //   postId: postId
    // };
    // Posts.addScore(
    //   options,
    //   // Success
    //   function (data, status, headers, config) {
    //     if (!$scope.post.score) {
    //       $scope.post.score = 0;
    //       $scope.post.scorers = [];
    //     }
    //     // update score and scorers array of the post
    //     $scope.post.score +=1;
    //     $scope.post.scorers.push($scope.currentUser.id);
    //   },
    //   // Failure
    //   function (data, status, headers, config) {

    //   }
    // );
  };
  $scope.removeScore = function (postId) {
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
    // var options = {
    //   postId: postId
    // };
    // Posts.removeScore(
    //   options,
    //   // Success
    //   function (data, status, headers, config) {
    //     // update score and scorers array of the post
    //     $scope.post.score -=1;
    //     var index = $scope.post.scorers.indexOf($scope.currentUser.id);
    //     $scope.post.scorers.splice(index,1);
    //   },
    //   // Failure
    //   function (data, status, headers, config) {

    //   }
    // );
  };

  $scope.loadMorePosts = function () {
    $scope.postsBox.loading = true;
    var params = {
      limit: 5,
      commentsLimit: 1,
      dateBefore: $scope.posts[$scope.posts.length -1].createdAt
    };
    if ($scope.$parent.filter.selected !== 'All') {
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

    // when this controller destroyed remove all socket listeners
    $scope.$on('$destroy', function (event) {
      socket.removeAllListeners();
    });

    // register socket events
    registerSocketEvents();

    // register init data

    $scope.postForm = {};

    // $scope.$parent.filter = {
    //   items: ['All', 'General', 'Basketball', 'Badminton'],
    //   selected: "All"
    // };

    $scope.postsBox = {
      loading: true
    };

    // Get posts from server
    var params = { 
      limit: 5,
      commentsLimit: 1
    };
    Posts.list(
      { config : { params: params } },
      // Success
      function (data, status, headers, config) {
        $scope.postsBox.loading = false;
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
      var isViewing = $scope.$parent.filter.selected === 'All' ||
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

          $scope.posts[i].comments.push(data.comment);

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

  init();

}]);