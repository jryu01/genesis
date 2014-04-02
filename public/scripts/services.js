'use strict';

angular.module('genesisApp')
.factory('Auth', ['$http', function ($http) {

  var currentUser = {};

  return {
    signedin: function (success, error) {
      $http.get('/signedin').success(function (user) {
        var isSignedIn = false;

        // change currentUser to signed in user
        if (user !== '0') {
          angular.extend(currentUser, user);
          isSignedIn = true;
          
        // change currentUser to empty object
        } else {
          angular.extend(currentUser, {});
        }
        success(isSignedIn);
      }).error(error);
    },
    signout: function (success, error) {
      $http.post('/signout').success(success).error(error);
    },
    currentUser: currentUser
  };
}])
.factory('Users', ['$http', function ($http) {
  return {
    list: function (success, error) {
      $http.get('/api/users').success(success).error(error);
    }
  };
}]);