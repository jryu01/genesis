/**
p
 * MainController
 */
'use strict';

angular.module('genesisApp')
.controller('MainController', 
['$scope', '$state', 'Auth', 'socket', 'Posts',
function ($scope, $state, Auth, socket, Posts) {
  console.log("user from MainController");
  console.log($scope.currentUser);

  registerSocketListeners();

  // signout function
  $scope.signout = function () {
    Auth.signout(
      // Success
      function (reponse) {
        socket.emit('signout');
        $state.go('app.public.start');
      },
      // Fauilure
      function (response) {
        // handle this situation
      }
    );
  }; 
  function registerSocketListeners() {

    // when this controller is destroyed remove all socket listeners
    $scope.$on('$destroy', function (event) {
      socket.removeAllListeners();
    });

    socket.on('newPost', function (data) {
      $scope.$broadcast('socket newPost', data);
    }); 

    socket.on('updateScore', function (data) {
      $scope.$broadcast('socket updateScore', data);
    });

    socket.on('newComment', function (data) {
      $scope.$broadcast('socket newComment', data);
    });

    socket.on('error', function (data) {
      // TODO: show error message
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
