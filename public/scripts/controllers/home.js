'use strict';

angular.module('genesisApp')
  .controller('HomeController', ['$scope', '$location', 'Auth', function ($scope, $location, Auth) {

    //controller code goes here
    $scope.greeting = 'Hello ' + $scope.user.facebook.name + '!';  

    // signout function
    $scope.signout = function () {
      Auth.signout(
        // Success
        function (reponse) {
          $location.path('/login');
        },
        // Fauilure
        function (response) {
          // handle this situation
        }
      );
    }; 

  }]);
