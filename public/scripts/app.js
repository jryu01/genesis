'use strict';

angular.module('genesisApp', ['ui.router'])
.config(['$stateProvider','$urlRouterProvider', '$locationProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

  //================================================
  // Route configurations 
  //================================================

  // Use html5 push state 
  $locationProvider.html5Mode(true);

  // Root state
  $stateProvider
    .state('app', {
    url: '/',
    template: '<div ui-view></div>',
    data: {
      authenticate: true
    }
  });

  // Public routes
  $stateProvider
    .state('app.public', {
      abstract: true,
      template: "<div ui-view></div>",
      data: {
        authenticate: false
      }
    })
    .state('app.public.start', {
      templateUrl: '/views/partials/start.html'
    });

  // Regular user routes
  $stateProvider
    .state('app.user', {
      abstract: true,
      template: "<div ui-view></div>"
    })
    .state('app.user.profile', {
      url: 'profile', 
      template: '<h1>profile</h1>'
    })
    .state('app.user.home', {
      templateUrl: '/views/partials/home.html',
      controller: 'HomeController'
    });


  // Handle invalid routes
  $urlRouterProvider.otherwise(function ($injector, $location) {
    var $state = $injector.get('$state');
    $state.go('app'); 
  });

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
            $state.go('app.public.start');
            return $q.reject(response);
          }
        }
      );
    };
  }]);
}])
.run(['$rootScope', '$state', 'Auth', function ($rootScope, $state, Auth) {
  $rootScope.$on('$stateChangeStart', 
  function(event, toState, toParams, fromState, fromParams){

    // if to state needs authentication
    if (toState.data.authenticate) {

      // if current user is not defiend 
      if (!Auth.isAuthenticated()) {
        event.preventDefault();

        // send request to server to check if user is signed in
        Auth.getSignedinUser(function (user) {

          // user is already signed in
          if (user) {
            $rootScope.currentUser = user;
            var to = (toState.name === 'app') ? 'app.user.home' : toState.name;
            $state.go(to);

          // need to sign in           
          } else {
            $state.go('app.public.start');
          }
        });
      // if there is current user
      } else {
        if (toState.name === "app") {
          event.preventDefault();
          $state.go('app.user.home');
        }
      }
    }
  });
}]);