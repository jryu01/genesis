'use strict';

angular.module('genesisApp')
.directive('myFocus', ['$timeout', '$parse', function($timeout, $parse){
  return {
    link: function (scope, element, attr) {
      var model = $parse(attr.myFocus);
      scope.$watch(model, function (newVal, oldVal) {
        if (newVal === true) {
          $timeout(function() {
            element[0].focus();
          });
        }
      });
    }
  };
}]);