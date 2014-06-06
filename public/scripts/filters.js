
'use strict';

angular.module('genesisApp')
.filter('myDate', ['$filter', function ($filter) {
  return function (input) {
    
    var A_DAY = 1000*60*60*24;
    var AN_HOUR = 1000*60*60;
    var A_MINUTE = 1000*60;

    var date = new Date(input);
    var now = new Date();
    var diff  = (now - date); // difference in milliseconds

    if (diff < A_MINUTE) {
      var secondsAgo = Math.round(diff/(1000));
      return (secondsAgo > 0) ? secondsAgo + ' seconds ago': 'Just now'; 

    } else if (diff < AN_HOUR) {
      var minutesAgo = Math.round(diff/(1000*60));
      return minutesAgo + ' mins';

    } else if (diff < A_DAY) {
      var hoursAgo = Math.round(diff/(1000*60*60));
      return hoursAgo + ' hr';

    } else {
      return $filter('date')(input, 'MMM d');
    }
  };
}]);