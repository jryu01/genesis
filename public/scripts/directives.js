'use strict';

angular.module('genesisApp')
.directive('myFocus', ['$timeout', '$parse', function($timeout, $parse){
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var model = $parse(attrs.myFocus);
      scope.$watch(model, function (newVal, oldVal) {
        if (newVal === true) {
          $timeout(function() {
            element[0].focus();
          });
        }
      });
    }
  };
}])
.directive('myModal', [function () {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    template: '<div class="my-overlay">' +
              '  <div class="my-overlay-body" ng-transclude></div>' +
              '</div>',
    link: function (scope, element, attrs) {
      // myModalOpenStyle: bottom-up or right-left
      element.addClass(attrs.myModalOpenStyle);
      scope.$watch(attrs.myModalOpen, function (value) {
        if (value) {
          element.addClass('active');
        } else {
          element.removeClass('active');
        }
      });
    }
  };
}]);