/**
p
 * MainController
 */
'use strict';

angular.module('genesisApp')
.controller('MainController', 
['$scope', '$state', 'AuthService', 'socket', 'geolocation',
function ($scope, $state, AuthService, socket, geolocation) {
  console.log("user from MainController");
  $scope.currentUser = AuthService.getUser();
  console.log($scope.currentUser);

  // get current location of the user
  geolocation.getCurrentLocation().then(function(location) {
    $scope.currentUser.currentLocation = location;
  });

  registerSocketListeners();

  // signout function
  $scope.signout = function () {
    AuthService.logout();
    socket.emit('signout');
    $state.go('app.public.start');
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
