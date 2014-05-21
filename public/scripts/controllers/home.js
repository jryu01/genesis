/**
 * HomeController
 */
'use strict';

angular.module('genesisApp')
.controller('HomeController', ['$scope', '$state', 'Auth', 'socket',
function ($scope, $state, Auth, socket) {

  $scope.data = {
    titles: ['Home', 'Event'],
    slideIndex: 0
  };

  /*
  * Filter related functions
  */
  $scope.filter = {
    items: ['All', 'General', 'Basketball', 'Badminton'],
    selected: "All"
  };
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

}]);
