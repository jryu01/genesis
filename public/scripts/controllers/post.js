angular.module('genesisApp')
.controller('PostController', ['$scope', '$stateParams', 'socket', 'Posts',
function ($scope, $stateParams, socket, Posts) {
  init();  

  $scope.addScore = function (postId, $event) {
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
  };

  function init() {     
    console.log($stateParams);
    $scope.post = {};
    $scope.loading = true;

    Posts.get({ postId: $stateParams.id },
      // Success
      function (data, status, headers, config) {
        $scope.post = data;
        $scope.loading = false;
      }, 
      // Error
      function (data, status, headers, config) {
        // TODO: handle error
      }
    ); 
  }
}]);