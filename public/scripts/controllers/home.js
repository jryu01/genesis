'use strict';

angular.module('genesisApp')
  .controller('HomeController', ['$scope', '$state', 'Auth', function ($scope, $state, Auth) {
    console.log("user from controller");
    console.log($scope.currentUser);
    //controller code goes here
    $scope.greeting = 'Hello ' + $scope.currentUser.facebook.name + '!';  

    $scope.goProfile = function () {
      $state.go('app.user.profile');
    };

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
