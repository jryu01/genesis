'use strict';

angular.module('genesisApp', 
  [ 'ui.router', 
    'mobile-angular-ui', 
    'ui.bootstrap', 
    'angular-carousel',
    'infinite-scroll', 
    'restangular', 
    'ngCookies',
    'genesisApp.services'
  ]
)
.constant('ACCESS_LEVELS', {
  pub: 1,
  user: 2
})
.constant('sportsList', [
  'General',
  'Basketball',
  'Badminton'
])
.constant('googleMapApiKey', 'AIzaSyAW2_RQG0vXnwFpgbADoblbL4XK8fHMPu8')
.config(['$stateProvider','$urlRouterProvider', '$locationProvider', '$httpProvider', 'ACCESS_LEVELS', function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, ACCESS_LEVELS) {

  //================================================
  // Route configurations 
  //================================================

  // Use html5 push state 
  $locationProvider.html5Mode(true);

  // Root state
  $stateProvider
    .state('app', {
    url: '/',
    template: '<div ui-view class="full-height"></div>',
    data: {
      accessLevel: ACCESS_LEVELS.user
    }
  });

  // Public routes
  $stateProvider
    .state('app.public', {
      abstract: true,
      template: '<div ui-view class="full-height"></div>',
      data: {
        accessLevel: ACCESS_LEVELS.pub
      }
    })
    .state('app.public.start', {
      templateUrl: '/views/partials/login.html',
      controller: 'LoginController'
    })
    .state('app.public.login', {
      url: 'login',
      templateUrl: '/views/partials/login.html',
      controller: 'LoginController'
    }).state('app.public.facebooklogin', {
      url: 'facebooklogin',
      controller: function ($state, Restangular, $log, facebook, AuthService) {
        facebook.getLoginStatus().then(function (result) {
          if (result.authResponse && result.status == 'connected') {
            var data = {
              grantType: 'facebook_token',
              token: result.authResponse.accessToken
            };
            // exchange access token with facebook token
            Restangular.all('access_token').post(data).then(function (result) {
              var user = {};
              user.id = result.user.id;
              user.access_token = result.access_token;
              user.role = ACCESS_LEVELS.user; 
              AuthService.setUser(user);
              $state.go('app.user.home');
            });
          } else {
            $state.go('app.public.login');
          }
        }).catch(function (reason) {
          $log.error(reason);
          $state.go('app.public.login');
        });
      } 
    });


  // Regular user routes
  $stateProvider
    .state('app.user', {
      abstract: true,
      templateUrl: '/views/partials/layout.html',
      controller: 'MainController'
    })
    .state('app.user.home', {
      views: {
        '': {
          templateUrl: 'views/partials/home.html',
          controller: 'HomeController'
        },
        'feeder@app.user.home': {
          templateUrl: 'views/partials/feeder.html',
          controller: 'FeederController'
        },
        'eventOrganizer@app.user.home': {
          templateUrl: 'views/partials/eventOrganizer.html',
          controller: 'EventOrganizerController'
        }
      }
    })
    .state('app.user.post', {
      url: 'post/:id?comment',
      templateUrl: 'views/partials/post.html',
      controller: 'PostController'
    })
    .state('app.user.event', {
      url: 'event/:id?comment',
      templateUrl: 'views/partials/event.html',
      controller: 'EventController'
    })
    .state('app.user.nearby', {
      abstract: true,
      url: 'nearby',
      template: '<div ui-view class="full-height"></div>',
      controller: 'NearbyController'
    })
    .state('app.user.nearby.list', {
      url: '',
      templateUrl: 'views/partials/nearby.list.html',
    })
    .state('app.user.nearby.map', {
      url: '/map',
      templateUrl: 'views/partials/nearby.map.html',
    })
    .state('app.user.place', {
      url: 'place/:id',
      templateUrl: 'views/partials/place.html',
      controller: 'PlaceController'
    })
    .state('app.profile', {
      url: 'profile', 
      templateUrl: 'views/partials/profile.html'
    });
    // .state('app.user.messages', {
    //   url: 'messages', 
    //   template: '<div>Messages</div>'
    // })
    // .state('app.user.settings', {
    //   url: 'settings',
    //   template: '<div>Settings</div>'
    // });

  // Handle invalid routes
  $urlRouterProvider.otherwise(function ($injector, $location) {
    var $state = $injector.get('$state');
    $state.go('app'); 
  });

  //================================================
  // An interceptor for AJAX errors
  //================================================
  var interceptor = ['$q', '$rootScope', '$injector', 'AuthService',
  function ($q, $rootScope, $injector, AuthService) {
    return {
      request: function (request) {
        if (request.url.indexOf('api/') >= 0) {
          request.params = request.params || {};
          request.params.access_token = AuthService.getToken();
        }
        return request;
      },
      responseError: function (rejection) {
          if (rejection.status === 401) {
            var $state = $injector.get('$state');            
            $state.go('app.public.login');
          }
        return $q.reject(rejection);
      }
    };
  }];
  $httpProvider.interceptors.push(interceptor);

}])
.config(['facebookProvider', function (facebookProvider) {
  facebookProvider.setAppId(260509677458558);
}])
.config(['RestangularProvider', function (RestangularProvider) {
  // RestangularProvider.setBaseUrl('http://localhost:3000/api');
  RestangularProvider.setBaseUrl('/api');
}])
.config(function ($provide) {
  $provide.decorator('PostService', function ($delegate, $log) {
    var decorated = {};
    var getPosts = function (params) {
      var startAt = new Date();
      var getPosts = $delegate.getPosts(params);
      getPosts.finally(function () {
        $log.info('Fetching posts took ' + (new Date() - startAt) + ' ms');
      });     
      return getPosts;
    };

    angular.extend(decorated, $delegate, { getPosts: getPosts });
    return decorated;
  });
})
.run(['$rootScope', '$state', 'AuthService','Auth', function ($rootScope, $state, AuthService, Auth) {
  $rootScope.$on('$stateChangeStart', 
    function (event, toState, toParams, fromState, fromParams) {
    if (!AuthService.isAuthorized(toState.data.accessLevel)) {
      if (AuthService.isLoggedIn()) {
        // the user is logged in, but does not have permissions
        // to view the view 
        event.preventDefault();
        $state.go('app.user.home');
      } else {
        event.preventDefault();
        $state.go('app.public.start');
      }
    } else {
     if (toState.name === "app") {
        event.preventDefault();
        $state.go('app.user.home');
      }
    }
  });

  // Save states to rootscope on statChangeSuccess
  $rootScope.$on('$stateChangeSuccess', 
  function (event, toState, toParams, fromState, fromParams) {
    $rootScope.previousState = fromState.name;
    $rootScope.currentState = toState.name;
  });
}]);