'use strict';

angular.module('genesisApp', ['ui.router'])
.config(['$stateProvider','$urlRouterProvider', '$locationProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

  //================================================
  // Check if a user is connected
  //================================================
  var checkSignin = ['$q', '$timeout', '$state', '$rootScope', 'Auth', 
  function ($q, $timeout, $state, $rootScope, Auth) {
    // Initialize a new promise
    var deferred = $q.defer();

    // Check if the user is signed in
    Auth.signedin(
      // On Success
      function (isSignedIn) {
        // Authenticated
        if (isSignedIn) {
          $timeout(deferred.resolve, 0);
        // Not authenticated
        } else {
          $rootScope.message = 'You need to log in.';
          $timeout(function () { deferred.reject(); }, 0);
          $state.go('public.login');
        } 
      } 
    );
    return deferred.promise;
  }];

  //================================================
  // Route configurations 
  //================================================

  // Use html5 push state 
  $locationProvider.html5Mode(true);

  // Public routes
  $stateProvider
    .state('public', {
      abstract: true,
      template: "<div ui-view></div>"
    })
    .state('public.login', {
      templateUrl: '/views/partials/login.html'
    });

  // Regular user routes
  $stateProvider
    .state('user', {
      abstract: true,
      template: "<div ui-view></div>",
      resolve: {
        requiresSignin: checkSignin
      }
    })
    .state('user.home', {
      url: '/',
      templateUrl: '/views/partials/home.html',
      controller: 'HomeController'
    });

  // Handle invalid routes
  $urlRouterProvider.otherwise('/');

  //================================================
  // An interceptor for AJAX errors
  //================================================

  $httpProvider.interceptors.push(['$q', '$injector', function($q, $injector) {
    return function (promise) {
      return promise.then(
        // Successs
        function (response) {
          return response;
        },
        // Error 
        function (response) {
          if (response.status === 401) {
            var $state = $injector.get('$state');
            $state.go('public.login');
            return $q.reject(response);
          }
        }
      );
    };
  }]);
}]);