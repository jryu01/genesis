'use strict';

angular.module('genesisApp.services', [])
.provider('facebook', [function () {
  var config = {
    permissions: 'email',
    appId: null,
    version    : 'v2.0'
  };
  var initParams = {};

  this.setAppId = function (appId) {
    config.appId = appId;
    return this;
  };
  this.setInitParams = function (params) {
    initParams = params;
    return this;
  };
  this.setPermissions = function (permissions) {
    config.permission = permissions;
    return this;
  };

  this.$get = ['$q', '$window', '$rootScope', 
  function ($q, $window, $rootScope) {

    // defered facebook servcie object
    var facebook = $q.defer();

    $window.fbAsyncInit = init;

    // Load the facebook SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }($window.document, 'script', 'facebook-jssdk'));

    // define facebook init function
    function init(result) {
      if (!config.appId) {
        throw "facebookProvider: `appId` cannot be null";
      }
      $rootScope.$apply(function() {
        $window.FB.init(angular.extend(config, initParams));
        facebook.resolve($window.FB);
      });
    }

    facebook.getAppId = function () {
      return config.appId; 
    };
    facebook.getLoginStatus = function (force) {
      var deferred = $q.defer();

      return facebook.promise.then(function (FB) {
        FB.getLoginStatus(function (response) {
          if (response.error) {
            deferred.reject(response.error);
          } else {
            deferred.resolve(response);
          }
          $rootScope.$apply();
        }, force);
        return deferred.promise;
      });
    };

    facebook.login = function (permissions) {
      var deferred = $q.defer();

      if (permissions === undefined) {
        permissions = config.permissions;
      }

      return facebook.promise.then(function (FB) {
        FB.login(function (response) {
          if (response.authResponse) {
            deferred.resolve(response);
          } else {
            deferred.reject("User cncelled login");
          }
          $rootScope.$apply();
        }, { scope: permissions });
        return deferred.promise;
      });
    };
    return facebook;
  }];

}])
.factory('AuthService', ['$cookieStore', 'ACCESS_LEVELS', 
function ($cookieStore, ACCESS_LEVELS) {

  var currentUser = $cookieStore.get('user');

  var setUser = function (user) {
    if (!user.role || user.role < 0) {
      user.role = ACCESS_LEVELS.pub;
    }
    currentUser = user;
    $cookieStore.put('user', currentUser);
  };

  return  {
    isAuthorized: function (lvl) {
      var userRole = currentUser ? currentUser.role : ACCESS_LEVELS.pub;
      return userRole >= lvl;
    },
    setUser: setUser,
    isLoggedIn: function () {
      return currentUser ? true : false;
    },
    getUser: function () {
      return currentUser;
    },
    getId: function () {
      return currentUser ? currentUser.id : null;
    },
    getToken: function () {
      return currentUser ? currentUser.access_token : '';
    },
    logout: function () {
      $cookieStore.remove('user');
      currentUser = null;
    }
  };
}])
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
.factory('socket', ['$rootScope', '$window', 'AuthService', 
  function ($rootScope, $window, AuthService) {
  var socket = $window.io.connect('', {
    query: 'access_token=' + AuthService.getToken()
  });
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
.factory('Post', ['Restangular', function (Restangular) {
  var Post = Restangular.service('posts');
  Restangular.extendModel('posts', function (model) {
      model.addComment = function (comment) {
        return this.post('comments', comment);
      };
      return model;
    });
  return Post;
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
    addScore: function (options, success, error) {
      var url = 'api/events/' + options.data + '/score' ;
      return $http.post(url, options.data);
    },
  };
}]);