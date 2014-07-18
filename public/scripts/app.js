'use strict';

angular.module('genesisApp', 
  [ 'ui.router', 'mobile-angular-ui', 'ui.bootstrap', 'angular-carousel',
    'infinite-scroll', 'restangular']
)
.constant('sportsList', [
  'General',
  'Basketball',
  'Badminton'
])
.constant('googleMapApiKey', 'AIzaSyAW2_RQG0vXnwFpgbADoblbL4XK8fHMPu8')
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
    template: '<div ui-view class="full-height"></div>',
    data: {
      authenticate: true
    }
  });

  // Public routes
  $stateProvider
    .state('app.public', {
      abstract: true,
      template: '<div ui-view class="full-height"></div>',
      data: {
        authenticate: false
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
      templateUrl: 'views/partials/profile.html',
      controller: function ($scope, PostService) {
        // $scope.posts = PostService.getPosts().$object;

        PostService.getPostById('53bec2bcc2d7915a453e0037').then(function (post) {
          $scope.post = post;
          $scope.post.getList('comments');
        });
        // $scope.post.getList('comments');


        // PostService.getPostById('53bec2bcc2d7915a453e0037').then(function (post) {
        //   console.log(post); 
        //   $scope.post = post;
        //   post.getList('comments');
        // });
        // $scope.post.getList('comments');
        // $scope.comments = PostService.getComments('53bec2bcc2d7915a453e0037').$object;
      }
    })
    .state('app.user.messages', {
      url: 'messages', 
      template: '<div>Messages</div>'
    })
    .state('app.user.settings', {
      url: 'settings',
      template: '<div>Settings</div>'
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
      // return promise.then(
      //   // Successs
      //   function (response) {
      //     return response;
      //   },
      //   // Error 
      //   function (response) {
      //     if (response.status === 401) {
      //       var $state = $injector.get('$state');
      //       $state.go('app.public.start');
      //       return $q.reject(response);
      //     }
      //   }
      // );
    };
  }]);
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
.run(['$rootScope', '$state', 'Auth', function ($rootScope, $state, Auth) {
  // Authentication on stateChnageStart
  $rootScope.$on('$stateChangeStart', 
  function (event, toState, toParams, fromState, fromParams){

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
            $state.go(to, toParams);

          // need to sign in           
          } else {
            $state.go('app.public.start');
          }
        });
      // if there is a current user using this app
      } else {
        if (toState.name === "app") {
          event.preventDefault();
          $state.go('app.user.home');
        }
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