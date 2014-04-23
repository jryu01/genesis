/**
 * HomeController
 */
'use strict';

angular.module('genesisApp')
.controller('HomeController', ['$scope', '$state', 'Auth', 
function ($scope, $state, Auth) {
  console.log("user from HomeController");
  console.log($scope.currentUser);

  // signout function
  $scope.signout = function () {
    Auth.signout(
      // Success
      function (reponse) {
        $state.go('app.public.start');
      },
      // Fauilure
      function (response) {
        // handle this situation
      }
    );
  }; 
}]);
