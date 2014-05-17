/**
 * ToplevelController
 */
'use strict';

angular.module('genesisApp')
.controller('ToplevelController', ['$scope', '$state', 'Auth', 'socket',
function ($scope, $state, Auth, socket) {
  console.log("user from ToplevelController");
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
