'use strict';

angular.module('genesisApp')
.factory('Auth', ['$http', function ($http) {

  var currentUser = null;
  return {
    getSignedinUser: function (callback) {
      // check if user is signed in and get ther user from serrver

      // add query date to prevent http get it from cache (force to send req)
      $http.get('/signedin?date='+ new Date()).success(function (user) {
        // change currentUser to signed in user
        if (user !== '0') {
          currentUser = user;
        } 
        callback(currentUser);
      });
    },
    signout: function (success, error) {
      $http.post('/signout').success(function() {
        currentUser = null;
        success();
      }).error(error);
    },
    // check if user is authenticated
    isAuthenticated: function () {
      return !!currentUser;
    },
  };
}])
.factory('Users', ['$http', function ($http) {
  return {
    list: function (success, error) {
      $http.get('/api/users').success(success).error(error);
    }
  };
}]);