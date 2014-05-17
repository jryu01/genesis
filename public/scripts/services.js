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
.factory('Posts', ['$http', function ($http) {
  return {
    list: function (options, success, error) {
      $http.get('api/posts', options.config)
      .success(success)
      .error(error);
    },
    get: function (options, success, error) {
      var url = 'api/posts/' + options.postId;
      $http.get(url, options.config)
      .success(success)
      .error(error);
    },
    create: function (options, success, error) {
      $http.post('api/posts', options.data)
      .success(success)
      .error(error); 
    },
    addComment: function (options, success, error) {
      var url = 'api/posts/' + options.postId + '/comments' ;
      $http.post(url, options.data)
      .success(success)
      .error(error);
    },
    addScore: function (options, success, error) {
      var url = 'api/posts/' + options.postId + '/score' ;
      $http.post(url, options.data)
      .success(success)
      .error(error);
    },
    removeScore: function (options, success, error) {
      var url = 'api/posts/' + options.postId + '/score' ;
      $http.delete(url, options.data)
      .success(success)
      .error(error);
    },
  };
}])
.factory('EventsFromService', ['$http', function ($http) {
  return {
    list: function (options, success, error) {
      $http.get('api/events', options.config)
      .success(success)
      .error(error);
    },
    create: function (options, success, error) {
      $http.post('api/events', options.data)
      .success(success)
      .error(error); 
    },
  };
}]);