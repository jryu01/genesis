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
.factory('socket', ['$rootScope', '$window', function ($rootScope, $window) {
  var socket = $window.io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    removeAllListeners: function () {
      socket.removeAllListeners();
    }
  };
}])
.factory('geolocation', ['$q', '$window', function ($q, $window) {

  return {
    getCurrentPosition: function (options) {
      var deferred = $q.defer();
      if ($window.navigator && $window.navigator.geolocation) {
        $window.navigator.geolocation.getCurrentPosition(function (position) {
          deferred.resolve(position);
        });
      } else {
        deferred.reject();
      }
      return deferred.promise;
    }
  };
}])
.factory('Posts', ['$http', function ($http) {
  return {
    list: function (options) {
      return $http.get('api/posts', options.config);
    },
    get: function (options) {
      var url = 'api/posts/' + options.postId;
      return $http.get(url, options.config);
    },
    create: function (options) {
      return $http.post('api/posts', options.data);
    },
    addComment: function (options) {
      var url = 'api/posts/' + options.postId + '/comments' ;
      return $http.post(url, options.data);
    },
    addScore: function (options) {
      var url = 'api/posts/' + options.postId + '/score' ;
      return $http.post(url, options.data);
    },
    removeScore: function (options) {
      var url = 'api/posts/' + options.postId + '/score' ;
      return $http.delete(url, options.data);
    },
  };
}])
.factory('Places', ['$http', function ($http) {
  return {
    list: function (options) {
      var params = {};
      angular.extend(params, options);
      return $http.get('api/places', { params: params });
    },
    create: function (data) {
      return $http.post('api/places', data);
    }
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