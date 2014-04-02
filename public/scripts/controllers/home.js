'use strict';

angular.module('genesisApp')
  .controller('HomeController', ['$scope', '$state', 'Auth', function ($scope, $state, Auth) {

    //controller code goes here
    $scope.greeting = 'Hello ' + $scope.user.facebook.name + '!';  

    // signout function
    $scope.signout = function () {
      Auth.signout(
        // Success
        function (reponse) {
          $state.go('public.login');
        },
        // Fauilure
        function (response) {
          // handle this situation
        }
      );
    }; 

  }]);
