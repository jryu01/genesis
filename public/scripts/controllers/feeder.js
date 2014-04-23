/**
 * FeederController
 */
 'use strict';

 angular.module('genesisApp')
.controller('FeederController', ['$scope', '$state', 'Posts', 
function ($scope, $state, Posts) {

  init();

  // Submit post form
  $scope.submit = function () {
    if (!$scope.postText) {
      return;
    }
    var newPost = {
      sport: "NYI", // TODO: select sport
      loc: [0,0],  // TODO: get location of current user
      contents: $scope.postText
    };
    Posts.create(newPost, 
      function (data, status, headers, config) {
        $scope.postText = null;
        $scope.posts.unshift(data);
      },
      // Failure
      function (data, status, headers, config) {

      });
  };
  $scope.loadMorePosts = function () {
    $scope.loading = true;
    var params = {
      limit: 5,
      dateBefore: $scope.posts[$scope.posts.length -1].createdAt
    };
    Posts.list(
      { params: params },
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
    var params = { limit: 5 };
    Posts.list(
      { params: params },
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