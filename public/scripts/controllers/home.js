/**
 * HomeController
 */
'use strict';

angular.module('genesisApp')
.controller('HomeController', ['$scope', '$state', 'Auth', 'socket',
function ($scope, $state, Auth, socket) {
  console.log("user from HomeController");
  console.log($scope.currentUser);

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
}]);
