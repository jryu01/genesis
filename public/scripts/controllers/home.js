/**
 * HomeController
 */
'use strict';

angular.module('genesisApp')
.controller('HomeController', ['$scope', '$state', 'Auth', 'socket',
function ($scope, $state, Auth, socket) {
  init();

  /*
  * Filter related functions
  */
  $scope.selectFilter = function (item) {
    $scope.filter.selected = item;
    $scope.$broadcast('select filter');
  };
  $scope.shiftFilter = function (flag) {
    var filters = $scope.filter.items;
    var index = filters.indexOf($scope.filter.selected);
    if (flag === 'next') {
      index = (index === filters.length - 1) ? 0 : index + 1;
    } else if (flag === 'prev') {
      index = (index === 0) ? filters.length - 1 : index - 1;
    }
    $scope.selectFilter(filters[index]);
  };

  $scope.openPostForm = function () {
    $scope.data.postFormOpened = true;
    selectSportForForm($scope.filter.selected);
  };
  $scope.cancelPostForm = function () {
    $scope.data.postFormOpened = false;
    // clear postFormData
    $scope.postFormData.selected = null;
    $scope.postFormData.text = null;
    $scope.postFormData.ready = false;
  };
  $scope.submitPostForm = function () {
    var isReady = !!$scope.postFormData.text && !!$scope.postFormData.selected;
    if(isReady) {
      // broadcasting for child controller to be notified
      $scope.$broadcast('submit post');
    }
  };

  function selectSportForForm(item) {
    if (item === null) {
      return ($scope.postFormData.selected = null); 
    }
    for (var i = 0; i < $scope.sports.length; i++) {
      if ($scope.sports[i].name === item) {
        $scope.postFormData.selected = $scope.sports[i];
      }
    }
  }
  function init() {
    $scope.data = {
      titles: ['Home', 'Event'],
      slideIndex: 0,
      postFormOpened: false
    };
    // made of user's favorite sports
    $scope.filter = {
      items: [null, 'General', 'Basketball', 'Badminton'],
      selected: null
    };
    $scope.sports = [
      {name: 'General', value: 'General'},
      {name: 'Basketball', value: 'Basketball'},
      {name: 'Badminton', value: 'Badmintonl'}
    ];
    $scope.postFormData = {
      selected: null,
      text: null,
      ready: false
    };
    $scope.$watch('postFormData.selected', function (newVal, oldVal) {
      $scope.postFormData.ready = !!$scope.postFormData.text && 
                                  !!$scope.postFormData.selected;
    });
    $scope.$watch('postFormData.text', function (newVal, oldVal) {
      $scope.postFormData.ready = !!$scope.postFormData.text && 
                                  !!$scope.postFormData.selected;
    });
  }

}]);
