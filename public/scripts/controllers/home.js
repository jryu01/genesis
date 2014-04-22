'use strict';

angular.module('genesisApp')
  .controller('HomeController', ['$scope', '$state', 'Auth', function ($scope, $state, Auth) {
    console.log("user from controller");
    console.log($scope.currentUser);
    //controller code goes here
    $scope.greeting = 'Hello ' + $scope.currentUser.facebook.name + '!';  

    $scope.navigate = function (to) {
      $state.go('app.user.' + to); 
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
