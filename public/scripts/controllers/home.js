'use strict';

angular.module('genesisApp')
  .controller('HomeController', ['$scope', '$state', 'Auth', function ($scope, $state, Auth) {

    //controller code goes here
    console.log(Auth.currentUser);
    $scope.greeting = 'Hello ' + Auth.currentUser.facebook.name + '!';  

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
