'use strict';

angular.module('genesisApp')
  .controller('HomeController', ['$scope', '$state', 'Auth', function ($scope, $state, Auth) {
    console.log("user from controller");
    console.log($scope.currentUser);
    //controller code goes here
    $scope.greeting = 'Hello ' + $scope.currentUser.facebook.name + '!';  

    $scope.goHome2 = function () {
      $state.go('app.user.home2');
    };

    // signout function
    $scope.signout = function () {
      Auth.signout(
        // Success
        function (reponse) {
          $state.go('app.public.login');
        },
        // Fauilure
        function (response) {
          // handle this situation
        }
      );
    }; 

  }]);
