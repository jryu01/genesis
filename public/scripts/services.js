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
  var defaultLocation = { lat: 43.653, lng: -79.383 }; //Toronto
  var latestCurrentLocation = null;
  return {
    getDefaultLocation: function () {
      return angular.copy(defaultLocation);
    },
    getLatestCurrentLocation: function () {
      return angular.copy(latestCurrentLocation);
    },
    getCurrentLocation: function () {
      var deferred = $q.defer();
      if ($window.navigator && $window.navigator.geolocation) {
        $window.navigator.geolocation.getCurrentPosition(function (position) {
          if (!latestCurrentLocation) latestCurrentLocation = {};
          latestCurrentLocation.lat = position.coords.latitude;
          latestCurrentLocation.lng = position.coords.longitude;

          deferred.resolve(angular.copy(latestCurrentLocation));
        });
      } else {
        latestCurrentLocation = null;
        deferred.reject();
      }
      return deferred.promise;
    },
    setDefaultLocation: function (lat, lng) {
      defaultLocation.lat = lat;
      defaultLocation.lng = lng;
      return angular.copy(defaultLocation);
    }
  };
}])
.factory('PostService', ['Restangular', function (Restangular) {
  // var restAngular = Restangular.withConfig(function (Configurer) {
  //   Configurer.setBaseUrl('/api/posts');
  // });
  var _postService = Restangular.all('posts');

  return {
    getPosts: function (params) {
      return _postService.getList(params);
    },
    getPostById: function (postId) {
      return _postService.get(postId);
    },
    createPost: function (newPost) {
      return _postService.post(newPost);
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
    get: function (placeId) {
      return $http.get('api/places/' + placeId);
    },
    create: function (data) {
      return $http.post('api/places', data);
    },
    addComment: function (placeId, data) {
      var url = 'api/places/' + placeId + '/comments';
      return $http.post(url, data);
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
    get: function (options, success, error) {
      var url = 'api/events/' + options.eventId;
      return $http.get(url, options.config);
    },
    addEventComment: function (options, success, error) {
      var url = 'api/events/' + options.eventId + '/comments' ;
      return $http.post(url, options.data);
    },
  };
}]);