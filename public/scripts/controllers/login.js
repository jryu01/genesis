/**
 * LoginController
 */
'use strict';

angular.module('genesisApp')
.controller('LoginController', ['$scope', '$state', '$window',
function ($scope, $state, $window) {
  console.log("hello");
  console.log($window.location);
  $scope.authFb = function () {
    $window.location = $window.location + 'auth/facebook';
  };
}]);